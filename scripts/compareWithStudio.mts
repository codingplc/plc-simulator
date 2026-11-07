/**
 * Runs real shared diagrams through both runtimes and compares their outputs.
 *
 * Local only: it needs a built checkout of the Rungs repo, and the diagrams are users' own
 * programs, so neither belongs here.
 *   RUNGS_REPO=~/GitHub/rungs pnpm exec tsx scripts/compareWithStudio.mts sample.jsonl [limit] [shard/shards]
 */
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
import { CYCLE_TIME } from "../src/consts/consts";
import { cycleScan } from "../src/helpers/cycleScan";
import type { Diagram, Store } from "../src/interface";
import { diagramToRungs } from "../src/rungs/diagramToRungs";

const repo = process.env.RUNGS_REPO;
if (!repo) throw new Error("Set RUNGS_REPO to a built Rungs checkout");
const load = (path: string) => import(pathToFileURL(`${repo}/packages/${path}/dist/index.js`).href);
const { parseRungs } = await load("aoi-io");
const { runTestVectors, validateTestVector } = await load("test-runner");
const { compileRoutine } = await load("runtime");

const [file, limitText, shardText] = process.argv.slice(2);
const limit = Number(limitText ?? Infinity);
const [shard, shards] = (shardText ?? "0/1").split("/").map(Number);

// Timers are lined up in `scanLikeStudio`, so outputs can be compared almost scan for scan.
const SETTLED_SCANS = 2;
const STEPS = 24;

const random = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

function startingState(diagram: Diagram): Store {
  const draft = structuredClone(diagram) as Store;
  draft.temp = { simulation: true } as Store["temp"];
  for (const element of Object.values(draft.elements) as any[]) {
    element.memInput = false;
    element.prevCU = false;
    element.prevCD = false;
  }
  // A diagram can be shared mid-run. Studio starts a program clean, so both start clean.
  const writtenByProgram = new Set(
    Object.values(draft.elements).flatMap((element) => (element.parameters.output ?? []).map((p) => p.uuid)),
  );
  const usedByProgram = new Set(
    Object.values(draft.elements).flatMap((element) =>
      [...(element.parameters.input ?? []), ...(element.parameters.output ?? [])].map((p) => p.uuid),
    ),
  );
  for (const uuid of writtenByProgram) {
    if (draft.variables[uuid]?.type === "Bool") draft.variables[uuid].value = false;
  }
  // These parts only exist in Studio when the program uses them, so an unused one saved on
  // would hold the simulator's counter still with nothing to match it.
  for (const variable of Object.values(draft.variables)) {
    for (const part of ["R", "LD", "CD"]) {
      const uuid = variable.subVars?.[part];
      if (uuid && !usedByProgram.has(uuid)) draft.variables[uuid].value = false;
    }
  }
  for (const variable of Object.values(draft.variables)) {
    if (variable.type === "Timer") {
      draft.variables[variable.subVars.ET].value = 0;
      draft.variables[variable.subVars.Q].value = false;
      draft.variables[variable.subVars.IN].value = false;
    }
    if (variable.type === "Counter") {
      for (const part of ["QU", "QD", "CU"]) draft.variables[variable.subVars[part]].value = false;
    }
  }
  // Studio prescans like Logix: a CTU's .CU and a CTD's .CD start set, so a rung already on at
  // the start is not a rising edge, where a simulator counter counts it. That difference is
  // accepted (2026-11-07), and the converter notes the case where it always shows: a counter
  // with nothing before it. So, as with the timer scan below, the reference run starts the
  // way Studio does, or the difference would drown real faults.
  for (const element of Object.values(draft.elements) as any[]) {
    const counter = draft.variables[element.parameters.inOut?.[0]?.uuid];
    if (!counter || counter.type !== "Counter") continue;
    if (element.type === "CTU" || element.type === "CTUD") {
      element.prevCU = true;
      draft.variables[counter.subVars.CU].value = true;
    }
    if (element.type === "CTD") {
      element.prevCD = true;
      draft.variables[counter.subVars.CD].value = true;
    }
    if (element.type === "CTUD") element.prevCD = true;
  }
  return draft;
}

/**
 * A timer whose preset is shorter than one scan is done on the scan it starts in the
 * simulator, and a scan later in Studio. `scanLikeStudio` cannot take that scan back, because
 * the rest of the program has already read the done bit, so these are counted on their own.
 */
const hasTimerShorterThanAScan = (diagram: Diagram) =>
  Object.values(diagram.elements).some((element) => {
    if (!["TON", "TONR"].includes(element.type)) return false;
    const timer = diagram.variables[element.parameters.inOut?.[0]?.uuid];
    const preset = timer && diagram.variables[timer.subVars.PT]?.value;
    return typeof preset === "number" && preset > 0 && preset <= CYCLE_TIME;
  });

/**
 * Studio's timer adds no time on the scan its rung changes, and the simulator's adds a full
 * scan. That difference is accepted (2026-11-05): the simulator models no real PLC, so there
 * is no right answer to match. Left in, it would drown real faults, because a blinker drifts
 * a little further out of step on every cycle. So the reference run takes that scan back.
 */
// Studio faults on a negative timer preset, as Logix does, and the simulator runs on. A program
// that gets there has no right answer to match, so it is counted on its own.
let drovePresetNegative = false;

function scanLikeStudio(state: Store) {
  const timers = Object.values(state.elements).filter((element) => ["TON", "TONR", "TOF"].includes(element.type));
  const before = new Map(
    timers.map((timer) => {
      const variable = state.variables[timer.parameters.inOut[0].uuid];
      return [timer, state.variables[variable.subVars.IN].value];
    }),
  );
  cycleScan(state);
  const adjusted = new Set<string>();
  for (const timer of timers) {
    const uuid = timer.parameters.inOut[0].uuid;
    if (adjusted.has(uuid)) continue;
    adjusted.add(uuid);
    const { ET, IN, PT } = state.variables[uuid].subVars;
    const started = !before.get(timer) && state.variables[IN].value;
    const stopped = before.get(timer) && !state.variables[IN].value;
    const elapsed = state.variables[ET].value as number;
    const preset = state.variables[PT].value as number;
    if (preset < 0) drovePresetNegative = true;
    if (started && timer.type !== "TOF" && elapsed < preset) state.variables[ET].value = Math.max(0, elapsed - CYCLE_TIME);
    if (stopped && timer.type === "TOF") state.variables[ET].value = Math.min(preset, elapsed + CYCLE_TIME);
  }
}

const numeric = (value: unknown) => (typeof value === "boolean" ? Number(value) : value);

function buildTest(diagram: Diagram, conversion: ReturnType<typeof diagramToRungs>, seed: number) {
  const next = random(seed);
  const state = startingState(diagram);
  drovePresetNegative = false;
  const inputs = conversion.tags.filter((tag) => tag.usage === "input" && tag.dataType === "BOOL" && tag.sourceUuid);
  const outputs = conversion.tags.filter((tag) => tag.usage === "output" && tag.sourceUuid);
  const steps: unknown[] = [];
  // Scans from steps that had nothing to check, still owed to Studio's run.
  let carriedScans = 0;

  for (let step = 0; step < STEPS; step += 1) {
    const changes: Record<string, number> = {};
    for (const tag of inputs) {
      const variable = state.variables[tag.sourceUuid as string];
      // The first step has every input off, so the program starts from rest.
      const value = step > 0 && (next() < 0.3 ? !variable.value : Boolean(variable.value));
      variable.value = value;
      changes[tag.name] = Number(value);
    }
    const scans = SETTLED_SCANS + Math.floor(next() * 40);
    const history = new Map(outputs.map((tag) => [tag.name, [] as unknown[]]));
    for (let scan = 0; scan < scans; scan += 1) {
      scanLikeStudio(state);
      for (const tag of outputs) history.get(tag.name)?.push(numeric(state.variables[tag.sourceUuid as string].value));
    }
    const expect: Record<string, unknown> = {};
    for (const [name, values] of history) {
      const recent = values.slice(-SETTLED_SCANS);
      if (recent.every((value) => value === recent[0]) && Number.isFinite(recent[0])) expect[name] = recent[0];
    }
    // A step with nothing settled still has to run in Studio, or Studio misses its inputs and
    // scans and every later step compares two runs that are out of step. Studio needs every
    // step to check something, so it checks the inputs it was just given. With no inputs there
    // is nothing to place, so the scans join the next step instead.
    const hasChanges = Object.keys(changes).length > 0;
    if (Object.keys(expect).length === 0) {
      if (hasChanges) steps.push({ in: changes, advance: { scans }, expect: { ...changes } });
      else carriedScans += scans;
      continue;
    }
    steps.push({ ...(hasChanges && { in: changes }), advance: { scans: scans + carriedScans }, expect });
    carriedScans = 0;
  }
  return JSON.stringify([{ name: "matches the simulator", scanTime: `${CYCLE_TIME}ms`, steps }]);
}

const results: Record<string, number> = {};
const samples: Record<string, string[]> = {};
const record = (kind: string, sample?: string) => {
  results[kind] = (results[kind] ?? 0) + 1;
  if (sample && (samples[kind] ??= []).length < 6) samples[kind].push(sample);
};

let seen = 0;
for await (const line of createInterface({ input: createReadStream(file) })) {
  if (seen >= limit) break;
  seen += 1;
  if (seen % shards !== shard) continue;
  const { id, diagram } = JSON.parse(line) as { id: string; diagram: Diagram };
  let conversion;
  try {
    conversion = diagramToRungs(diagram);
  } catch (error) {
    record("converter crashed", `${id}: ${String(error).slice(0, 200)}`);
    continue;
  }
  const opened = parseRungs(conversion.rungsText);
  if (!opened.ok) {
    record("Studio refused the file", `${id}: ${opened.diagnostics.find((d: any) => d.type === "error")?.message.replace(/\s+/g, " ").slice(0, 240)}`);
    continue;
  }
  const elements = Object.values(diagram.elements ?? {});
  if (elements.length === 0) { record("empty project"); continue; }
  if (elements.some((element) => !element.configured)) { record("unfinished project (opens, not compared)"); continue; }
  if (!conversion.tags.some((tag) => tag.usage === "output")) { record("no outputs to compare"); continue; }

  let tests: string;
  try { tests = buildTest(diagram, conversion, seen); } catch (error) { record("simulator run crashed", `${id}: ${String(error).slice(0, 200)}`); continue; }
  if (JSON.parse(tests)[0].steps.length === 0) { record("no settled outputs to compare"); continue; }
  // A step with nothing settled checks its own inputs (see buildTest). The runner reads any
  // tag, but its validator only lets a test check what the AOI writes, so it is told the
  // inputs can be checked too. The run itself uses the real tags.
  const checkableTags = opened.aoi.tags.map((tag: { usage: string }) => (tag.usage === "input" ? { ...tag, usage: "inout" } : tag));
  const validated = validateTestVector(tests, checkableTags);
  if (!validated.success) { record("test could not be built", `${id}: ${JSON.stringify(validated.errors).slice(0, 240)}`); continue; }
  try {
    const run = await runTestVectors(validated.data, opened.aoi);
    if (run.failed === 0) { record("matched"); continue; }
    const error = String(run.details.find((detail: any) => detail.status === "failed")?.error);
    if (error.includes("Compilation failed")) {
      const compiled = compileRoutine({ aoi: opened.aoi, routine: opened.aoi.routines.Logic, routineName: "Logic" });
      const reason = JSON.stringify(compiled?.error ?? compiled?.diagnostics ?? compiled).slice(0, 300);
      record("Studio could not compile it", `${id}: ${reason}`);
      continue;
    }
    const kinds = new Set(elements.map((element) => element.type));
    const has = (types: string[]) => types.some((type) => kinds.has(type));
    const shape = [
      has(["TON", "TOF", "TONR"]) && "timer",
      has(["CTU", "CTD", "CTUD"]) && "counter",
      has(["OSP", "OSN"]) && "edge",
      has(["OTN"]) && "negated coil",
      has(["DIV", "MUL", "ADD", "SUB"]) && "math",
    ].filter(Boolean).join("+") || "contacts and coils only";
    if (drovePresetNegative) {
      record("differ: program drives a timer preset negative (Studio faults, as Logix does)", `${id}: ${error.slice(0, 170)}`);
      continue;
    }
    if (hasTimerShorterThanAScan(diagram)) {
      record("differ: timer preset shorter than one scan (accepted timing)", `${id}: ${error.slice(0, 170)}`);
      continue;
    }
    const step = Number(/step (\d+)/.exec(error)?.[1]);
    record(`differ: ${shape}${step <= 2 ? " (first steps)" : ""}`, `${id}: ${error.slice(0, 170)}`);
  } catch (error) {
    record("Studio run crashed", `${id}: ${String(error).slice(0, 200)}`);
  }
}
console.log(JSON.stringify({ results, samples }));
