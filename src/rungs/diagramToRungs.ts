import type { Diagram, Element, Variable } from "../interface";

/**
 * Turns a simulator diagram into a Rungs Studio `.rungs` file.
 *
 * The two runtimes disagree in ways that decide the shape of this file:
 * - A simulator timer or counter hands the next element its own Q output, whatever the rung
 *   into it was. A Studio one passes the rung through. So logic after one moves to a new rung
 *   that reads the done state, and a branch holding one is flattened through power bits.
 * - The simulator has no constants. A `1000` in a program is a Number variable named "1000".
 * - Timer and counter parts are ordinary variables there, so `OTE(Cnt.R)` is a real program.
 */

const AOI_NAME = "PlcSimulatorProject";
const NAME_MAX_LENGTH = 40;

// Studio refuses these as tag names. `EnableIn` and `EnableOut` are added to every AOI.
const RESERVED_NAMES = new Set(
  (
    "if then else elsif end_if case of end_case for to by do end_for while end_while repeat until end_repeat " +
    "exit true false and or xor not mod abs sqrt sin cos tan ln log acos asin atan deg rad trunc goto return " +
    "this begin_nt_rung end_nt_rung enablein enableout"
  ).split(" "),
);

const COMPARE_NAMES: Record<string, string> = {
  EQU: "EQ",
  NEQ: "NE",
  GRT: "GT",
  GEQ: "GE",
  LES: "LT",
  LEQ: "LE",
};

const COILS = new Set(["OTE", "OTL", "OTU", "OTN"]);
const MATH = new Set(["ADD", "SUB", "MUL", "DIV"]);
const MOVES = new Set(["MOV", "MOVE"]);
const TIMERS = new Set(["TON", "TOF", "TONR"]);
const COUNTERS = new Set(["CTU", "CTD", "CTUD"]);

// These cannot be written in place on a Studio rung, so a rung holding one is flattened.
const REWRITTEN = new Set([...TIMERS, ...COUNTERS, "OSP", "OSN", "OTN"]);

const TIMER_MEMBERS: Record<string, string> = { PT: "PRE", ET: "ACC", Q: "DN", IN: "EN" };
const COUNTER_MEMBERS: Record<string, string> = { PV: "PRE", CV: "ACC", CU: "CU", CD: "CD" };

type TagUsage = "input" | "output" | "local";
type DataType = "BOOL" | "DINT" | "REAL" | "TIMER" | "COUNTER";

export interface ConvertedTag {
  name: string;
  dataType: DataType;
  usage: TagUsage;
  description?: string;
  defaultValue?: number | Record<string, number>;
  /** The simulator variable this tag holds. A generated tag has none. */
  sourceUuid?: string;
}

export interface Conversion {
  rungsText: string;
  tags: ConvertedTag[];
  /** Plain sentences about what could not be carried over exactly. */
  notes: string[];
}

/**
 * The power reached so far on a rung, as conditions not yet written to the file. They are
 * evaluated where they are finally written, so the converter tracks what they would change
 * and what they read, to know when that is no longer the same as reading them in place.
 */
interface Power {
  conditions: string[];
  hasWrites: boolean;
  /** The variables the conditions read. A timer's or counter's parts count as the block. */
  reads: Set<string>;
}

/** What part of a diagram reads, and what running it changes. */
interface Effects {
  reads: Set<string>;
  changes: Set<string>;
}

const isElement = (diagram: Diagram, uuid: string) => uuid in diagram.elements;

const operandUuids = (element: Element, group: string): string[] =>
  (element.parameters[group] ?? []).map((parameter) => parameter.uuid);

/** A Number or Time named after its own value is how the simulator writes a constant. */
const isConstant = (variable: Variable, written: Set<string>, uuid: string): boolean =>
  (variable.type === "Number" || variable.type === "Time") &&
  !variable.parrent &&
  !written.has(uuid) &&
  variable.name.trim() !== "" &&
  Number(variable.name) === variable.value;

export function diagramToRungs(diagram: Diagram): Conversion {
  const { variables, elements } = diagram;
  const notes = new Set<string>();
  const usedNames = new Set<string>();

  // `I0.0` becomes the BOOL `I0_0`, not bit 0 of a DINT `I0`, though Studio could read that.
  // A BOOL Input gets a toggle, and a DINT would mean typing 8 to press `I0.3`. One word can
  // also mix bits set by hand with bits the program writes, and a tag cannot be both.
  const allocateName = (wanted: string): string => {
    let base = wanted
      .normalize("NFKD")
      // NFKD splits `ó` into `o` and an accent. The accent goes, or it would become `_`.
      .replace(/\p{M}+/gu, "")
      .replace(/[^A-Za-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (!base) base = "Tag";
    if (/^[0-9]/.test(base)) base = `_${base}`;
    if (RESERVED_NAMES.has(base.toLowerCase())) base = `${base}_Tag`;
    base = base.slice(0, NAME_MAX_LENGTH);
    let name = base;
    for (let suffix = 2; usedNames.has(name.toLowerCase()); suffix += 1) {
      const ending = `_${suffix}`;
      name = `${base.slice(0, NAME_MAX_LENGTH - ending.length)}${ending}`;
    }
    usedNames.add(name.toLowerCase());
    return name;
  };

  const written = new Set<string>();
  const read = new Set<string>();
  for (const element of Object.values(elements)) {
    for (const uuid of operandUuids(element, "output")) written.add(uuid);
    for (const uuid of [...operandUuids(element, "input"), ...operandUuids(element, "inOut")]) read.add(uuid);
  }

  // A timer or counter variable no block runs is only a set of plain variables.
  const runByABlock = new Set(
    Object.values(elements)
      .filter((element) => TIMERS.has(element.type) || COUNTERS.has(element.type))
      .flatMap((element) => operandUuids(element, "inOut")),
  );

  const timerTypes = (uuid: string): string[] =>
    Object.values(elements)
      .filter((element) => TIMERS.has(element.type) && operandUuids(element, "inOut").includes(uuid))
      .map((element) => element.type);

  const counterHasCountDownInput = new Set(
    Object.values(elements)
      .filter((element) => element.type === "CTUD")
      .flatMap((element) => operandUuids(element, "inOut")),
  );

  // DIV keeps its fraction in the simulator, and a DINT would round it away.
  const realVariables = new Set<string>();
  for (const [uuid, variable] of Object.entries(variables)) {
    if (typeof variable.value === "number" && !Number.isInteger(variable.value)) realVariables.add(uuid);
  }
  for (const element of Object.values(elements)) {
    if (element.type === "DIV") operandUuids(element, "output").forEach((uuid) => realVariables.add(uuid));
  }
  for (let changed = true; changed; ) {
    changed = false;
    for (const element of Object.values(elements)) {
      if (!MATH.has(element.type) && !MOVES.has(element.type)) continue;
      if (!operandUuids(element, "input").some((uuid) => realVariables.has(uuid))) continue;
      for (const uuid of operandUuids(element, "output")) {
        if (!realVariables.has(uuid)) {
          realVariables.add(uuid);
          changed = true;
        }
      }
    }
  }

  const tags: ConvertedTag[] = [];
  const tagNames = new Map<string, string>();

  const usageOf = (uuid: string): TagUsage => {
    if (written.has(uuid)) return "output";
    return read.has(uuid) ? "input" : "local";
  };

  const presetOf = (variable: Variable, member: string): number => {
    const value = variables[variable.subVars[member]]?.value;
    return typeof value === "number" ? value : 0;
  };

  const addScalarTag = (uuid: string, name: string, original: string) => {
    const variable = variables[uuid];
    const dataType: DataType =
      variable.type === "Bool" ? "BOOL" : realVariables.has(uuid) ? "REAL" : "DINT";
    // A BOOL the program writes holds only the state it was saved in, mid-run or not. Studio
    // starts a program clean, so it does not carry over.
    const startsClean = variable.type === "Bool" && written.has(uuid);
    const stored = typeof variable.value === "boolean" ? Number(variable.value) : (variable.value ?? 0);
    // A runaway calculation can save Infinity, which is not a value a tag can hold.
    const value = startsClean || !Number.isFinite(stored) ? 0 : stored;
    tags.push({
      name,
      dataType,
      usage: usageOf(uuid),
      ...(name !== original && { description: original }),
      ...(value !== 0 && { defaultValue: value }),
      sourceUuid: uuid,
    });
    tagNames.set(uuid, name);
  };

  for (const [uuid, variable] of Object.entries(variables)) {
    if (variable.parrent || isConstant(variable, written, uuid)) continue;
    const name = allocateName(variable.name);

    if (variable.type === "Timer" || variable.type === "Counter") {
      const preset = presetOf(variable, variable.type === "Timer" ? "PT" : "PV");
      const count = variable.type === "Counter" ? presetOf(variable, "CV") : 0;
      const defaults = { ...(preset !== 0 && { PRE: preset }), ...(count !== 0 && { ACC: count }) };
      tags.push({
        name,
        dataType: variable.type === "Timer" ? "TIMER" : "COUNTER",
        usage: "local",
        ...(name !== variable.name && { description: variable.name }),
        ...(Object.keys(defaults).length > 0 && { defaultValue: defaults }),
        sourceUuid: uuid,
      });
      tagNames.set(uuid, name);

      // Only parts the program itself reads or writes become tags. In the simulator the others
      // could be pressed by hand in the variable table, but a program does not depend on that.
      const ownTags =
        variable.type === "Timer"
          ? ["R"]
          : ["R", "LD", ...(counterHasCountDownInput.has(uuid) ? ["CD"] : [])];
      for (const member of ownTags) {
        const memberUuid = variable.subVars[member];
        if (memberUuid && (written.has(memberUuid) || read.has(memberUuid))) {
          addScalarTag(memberUuid, allocateName(`${name}_${member}`), `${variable.name}.${member}`);
        }
      }
      continue;
    }

    addScalarTag(uuid, name, variable.name);
  }

  const generatedTag = (wanted: string): string => {
    const name = allocateName(wanted);
    tags.push({ name, dataType: "BOOL", usage: "local" });
    return name;
  };

  const memberOf = (uuid: string): { parent: string; member: string; isTimer: boolean } | undefined => {
    const variable = variables[uuid];
    if (!variable?.parrent) return undefined;
    const parent = variables[variable.parrent];
    const member = Object.keys(parent?.subVars ?? {}).find((key) => parent.subVars[key] === uuid);
    if (!parent || !member) return undefined;
    return { parent: tagNames.get(variable.parrent) ?? "?", member, isTimer: parent.type === "Timer" };
  };

  /** The text for a value. `?` is Studio's own mark for a slot still to fill in. */
  const operand = (uuid: string): string => {
    const variable = variables[uuid];
    if (!variable) return "?";
    if (isConstant(variable, written, uuid)) return String(variable.value);
    const own = tagNames.get(uuid);
    if (own) return own;
    const part = memberOf(uuid);
    if (!part) return "?";
    if (!runByABlock.has(variable.parrent)) {
      if (variable.type === "Bool") return statusTag(uuid);
    }
    if (isStoredPart(uuid)) return statusTag(uuid);
    const members = part.isTimer ? TIMER_MEMBERS : COUNTER_MEMBERS;
    if (part.member === "ET") {
      if (timerTypes(variable.parrent).includes("TOF")) notes.add("An off-delay timer's elapsed time counts up in Rungs Studio, not down.");
    }
    return members[part.member] ? `${part.parent}.${members[part.member]}` : `${part.parent}.DN`;
  };

  // In the simulator a block's status parts are stored bits: the block sets them when it
  // runs, a program may write them too, and a read gets whichever came last. Studio's members
  // are the block's own: a write to `.CU` would count again, and `.DN` cannot be written to
  // stay. So a part Studio's member cannot stand for gets a tag of its own, which the block's
  // rungs set where it runs and every read and write of the part uses. That is a part the
  // program writes, and a timer's Q or a counter's QU and QD once the program can change what
  // Studio's reading of them depends on.
  const statusTags = new Map<string, string>();
  const statusTag = (uuid: string): string => {
    const part = memberOf(uuid);
    const existing = statusTags.get(uuid);
    if (existing) return existing;
    const tag = generatedTag(`${part?.parent}_${part?.member}`);
    statusTags.set(uuid, tag);
    return tag;
  };

  const timerOutputDrifts = (timerUuid: string): boolean => {
    const { Q, PT, ET } = variables[timerUuid].subVars;
    return written.has(Q) || written.has(PT) || (written.has(ET) && variables[PT]?.value === 0);
  };

  const counterOutputDrifts = (uuid: string): boolean => {
    const { CV, PV } = variables[variables[uuid].parrent].subVars;
    return written.has(uuid) || written.has(CV) || written.has(PV);
  };

  /** A part of a block-run timer or counter that is kept in a tag of its own. */
  const isStoredPart = (uuid: string): boolean => {
    const part = memberOf(uuid);
    if (!part || tagNames.has(uuid) || !runByABlock.has(variables[uuid].parrent)) return false;
    if (part.isTimer) {
      if (part.member === "Q") return timerOutputDrifts(variables[uuid].parrent);
      return part.member === "IN" && written.has(uuid);
    }
    if (part.member === "QU" || part.member === "QD") return counterOutputDrifts(uuid);
    return (part.member === "CU" || part.member === "CD") && written.has(uuid);
  };

  // A part no block runs is a plain bit, so a write to it gets a tag of its own as well.
  const writeOperand = (uuid: string): string => {
    const part = memberOf(uuid);
    if (!part || !["IN", "Q", "CU", "CD", "QU", "QD"].includes(part.member) || tagNames.has(uuid)) return operand(uuid);
    return statusTag(uuid);
  };

  /**
   * The simulator calls a timer done when its elapsed time equals its preset, and with a
   * preset of 0 that is always, even on a false rung. Studio's DN needs the rung true.
   *
   * A program that writes the preset can bring it to 0 while running. Its done bit stays a
   * stored bit like DN, and is also on whenever the preset is 0. Comparing ACC with PRE would
   * not do: a program that writes a longer preset when the timer is done would read it as not
   * done and time on instead of starting over.
   */
  const timerDoneContact = (timerUuid: string, negated: boolean): string | undefined => {
    const timer = variables[timerUuid];
    const name = tagNames.get(timerUuid);
    if (!timer || !name) return undefined;
    const preset = timer.subVars.PT;
    const types = timerTypes(timerUuid);
    if (written.has(preset)) {
      if (!types.every((type) => type === "TON")) return undefined;
      return negated ? `XIO(${name}.DN) NE(${name}.PRE,0)` : `[XIC(${name}.DN), EQ(${name}.PRE,0)]`;
    }
    if (variables[preset]?.value !== 0) return undefined;
    if (types.includes("TOF")) return `${negated ? "XIO" : "XIC"}(${name}.EN)`;
    return `${negated ? "LT" : "GE"}(${name}.ACC,${name}.PRE)`;
  };

  const timerQContact = (uuid: string, negated: boolean): string | undefined => {
    const part = memberOf(uuid);
    if (!part?.isTimer || part.member !== "Q" || !runByABlock.has(variables[uuid].parrent)) return undefined;
    return timerDoneContact(variables[uuid].parrent, negated);
  };

  /**
   * While only the counter changes its count and preset, comparing them gives what it last set.
   * Only CTU and CTUD set QU, and only CTD and CTUD set QD. Otherwise it is a plain bit.
   */
  const counterOutputContact = (uuid: string, negated: boolean): string | undefined => {
    const part = memberOf(uuid);
    if (!part || part.isTimer || (part.member !== "QU" && part.member !== "QD")) return undefined;
    if (!runByABlock.has(variables[uuid].parrent)) return undefined;
    const types = (variables[variables[uuid].parrent]?.usedBy ?? []).map((user) => elements[user]?.type);
    if (!types.includes("CTUD") && !types.includes(part.member === "QU" ? "CTU" : "CTD")) {
      return `${negated ? "XIO" : "XIC"}(${statusTag(uuid)})`;
    }
    if (part.member === "QU") return `${negated ? "LT" : "GE"}(${part.parent}.ACC,${part.parent}.PRE)`;
    return `${negated ? "GT" : "LE"}(${part.parent}.ACC,0)`;
  };

  const contact = (uuid: string, negated: boolean): string =>
    (isStoredPart(uuid) ? `${negated ? "XIO" : "XIC"}(${statusTag(uuid)})` : undefined) ??
    timerQContact(uuid, negated) ??
    counterOutputContact(uuid, negated) ??
    `${negated ? "XIO" : "XIC"}(${operand(uuid)})`;

  /** An element that keeps its meaning when written in place on a rung. */
  const inPlace = (element: Element): string => {
    const [first, second] = operandUuids(element, "input");
    const [output] = operandUuids(element, "output");
    if (element.type === "XIC") return contact(first, false);
    if (element.type === "XIO") return contact(first, true);
    if (COILS.has(element.type)) return `${element.type}(${writeOperand(output)})`;
    if (MOVES.has(element.type)) return `MOVE(${operand(first)},${writeOperand(output)})`;
    if (MATH.has(element.type)) return `${element.type}(${operand(first)},${operand(second)},${writeOperand(output)})`;
    return `${COMPARE_NAMES[element.type]}(${operand(first)},${operand(second)})`;
  };

  const executedTimers = new Set<string>();
  const output: string[] = [];
  const emit = (parts: string[]) => output.push(`${parts.join(" ")};`);

  const needsFlattening = (items: string[]): boolean =>
    items.some((uuid) =>
      isElement(diagram, uuid)
        ? REWRITTEN.has(elements[uuid].type)
        : (diagram.branches[uuid]?.rungs ?? []).some((rung) => needsFlattening(diagram.rungs[rung]?.elements ?? [])),
    );

  const inPlaceText = (items: string[]): string =>
    items
      .map((uuid) =>
        isElement(diagram, uuid)
          ? inPlace(elements[uuid])
          : `[${(diagram.branches[uuid]?.rungs ?? [])
              .map((rung) => inPlaceText(diagram.rungs[rung]?.elements ?? []))
              .join(", ")}]`,
      )
      .join(" ");

  const writes = (items: string[]): boolean =>
    items.some((uuid) => {
      if (!isElement(diagram, uuid)) {
        return (diagram.branches[uuid]?.rungs ?? []).some((rung) => writes(diagram.rungs[rung]?.elements ?? []));
      }
      const { type } = elements[uuid];
      return COILS.has(type) || MATH.has(type) || MOVES.has(type);
    });

  // A timer or counter changes all its parts at once, so a part is tracked as its block.
  const unitOf = (uuid: string): string => variables[uuid]?.parrent || uuid;

  const effectsOf = (items: string[]): Effects => {
    const effects: Effects = { reads: new Set(), changes: new Set() };
    for (const uuid of items) {
      if (!isElement(diagram, uuid)) {
        for (const rung of diagram.branches[uuid]?.rungs ?? []) {
          const inner = effectsOf(diagram.rungs[rung]?.elements ?? []);
          inner.reads.forEach((unit) => effects.reads.add(unit));
          inner.changes.forEach((unit) => effects.changes.add(unit));
        }
        continue;
      }
      const element = elements[uuid];
      for (const operand of operandUuids(element, "input")) effects.reads.add(unitOf(operand));
      for (const operand of operandUuids(element, "output")) effects.changes.add(unitOf(operand));
      // A block is read as well as run: what follows it reads its result.
      for (const operand of operandUuids(element, "inOut")) {
        effects.reads.add(unitOf(operand));
        effects.changes.add(unitOf(operand));
      }
    }
    return effects;
  };

  const readsOf = (items: string[]): Set<string> => effectsOf(items).reads;
  const union = (...sets: Set<string>[]): Set<string> => new Set(sets.flatMap((set) => [...set]));

  /** Pins the power reached so far, so what follows reads it as it stood at this point. */
  const pinned = (power: Power, wanted: string): Power => {
    if (power.conditions.length === 0) return power;
    const tag = generatedTag(wanted);
    emit([...power.conditions, `OTE(${tag})`]);
    return { conditions: [`XIC(${tag})`], hasWrites: false, reads: new Set() };
  };

  // No note for an empty slot: the person already sees `<???>` here, and Studio marks it too.
  const blockTag = (uuid: string): string => tagNames.get(uuid) ?? "?";

  /** Sets the stored parts a block just set, from what Studio's block now holds. */
  const setStoredParts = (block: Variable | undefined, settings: Record<string, string>) => {
    for (const [member, condition] of Object.entries(settings)) {
      const part = block?.subVars[member];
      if (!part || !isStoredPart(part) || (!read.has(part) && !written.has(part) && member !== "Q")) continue;
      emit([condition, `OTE(${statusTag(part)})`]);
    }
  };

  const flattenTimer = (element: Element, power: Power): Power => {
    const [uuid] = operandUuids(element, "inOut");
    const variable = variables[uuid];
    const name = blockTag(uuid);
    const live = timerDoneContact(uuid, false) ?? `XIC(${name === "?" ? "?" : `${name}.DN`})`;
    // A stored Q is set as the timer runs, and the block's own result is read from it too.
    const stored = variable?.subVars?.Q && isStoredPart(variable.subVars.Q) ? statusTag(variable.subVars.Q) : undefined;
    const done = stored ? `XIC(${stored})` : live;
    // The simulator runs a timer once per scan, and any later use only reads its output.
    if (executedTimers.has(uuid)) {
      return { ...power, conditions: [...power.conditions, done], reads: union(power.reads, new Set([uuid])) };
    }
    if (uuid) executedTimers.add(uuid);
    emit([...power.conditions, `${element.type === "TONR" ? "RTO" : element.type}(${name},?,?)`]);
    // Not RES: it also clears `.EN`, and the simulator's IN stays as the rung left it.
    if (element.type === "TONR" && variable && tagNames.has(variable.subVars.R)) {
      emit([contact(variable.subVars.R, false), `MOVE(0,${name}.ACC)`, `OTU(${name}.DN)`]);
    }
    if (name !== "?") setStoredParts(variable, { IN: `XIC(${name}.EN)`, Q: live });
    return { conditions: [done], hasWrites: false, reads: new Set([uuid]) };
  };

  const flattenCounter = (element: Element, power: Power): Power => {
    const [uuid] = operandUuids(element, "inOut");
    const variable = variables[uuid];
    const name = blockTag(uuid);
    if (variable?.usedBy.filter((user) => elements[user]).length > 1) {
      notes.add("Two counter blocks share one counter variable, so their counts may differ in Rungs Studio.");
    }
    // Studio prescans like Logix, so a rung already on at the start is not a rising edge. A
    // simulator counter counts it. Only a rung with nothing before the counter is sure to be
    // on then, and there Studio never counts at all.
    if (power.conditions.length === 0) {
      notes.add("A counter on a rung with nothing before it counts once when PLC Simulator Online starts, and never in Rungs Studio.");
    }
    emit([...power.conditions, `${element.type === "CTD" ? "CTD" : "CTU"}(${name},?,?)`]);
    if (element.type === "CTUD" && variable && tagNames.has(variable.subVars.CD)) {
      emit([contact(variable.subVars.CD, false), `CTD(${name},?,?)`]);
    }
    // A plain move, not RES: RES also forgets the rung was true, and the count would rise
    // again when the reset ends with the input still on. The simulator does not do that.
    if (element.type !== "CTU" && variable && tagNames.has(variable.subVars.LD)) {
      emit([contact(variable.subVars.LD, false), `MOVE(${name}.PRE,${name}.ACC)`]);
    }
    if (element.type !== "CTD" && variable && tagNames.has(variable.subVars.R)) {
      emit([contact(variable.subVars.R, false), `MOVE(0,${name}.ACC)`]);
    }
    // What each block sets, as setCtuOut, setCtdOut and setCtudOut do. A part no block sets
    // stays a plain bit. CTUD reads its CD as an input and leaves it alone.
    if (name !== "?") {
      const up = { CU: `XIC(${name}.CU)`, QU: `GE(${name}.ACC,${name}.PRE)` };
      const down = { QD: `LE(${name}.ACC,0)` };
      if (element.type === "CTU") setStoredParts(variable, up);
      else if (element.type === "CTD") setStoredParts(variable, { CD: `XIC(${name}.CD)`, ...down });
      else setStoredParts(variable, { ...up, ...down });
    }
    const result =
      element.type === "CTD" ? `LE(${name}.ACC,0)` : `GE(${name}.ACC,${name}.PRE)`;
    return { conditions: [result], hasWrites: false, reads: new Set([uuid]) };
  };

  const flattenEdge = (element: Element, before: Power): Power => {
    const power = before.hasWrites ? pinned(before, "Wrk_Power") : before;
    const [uuid] = operandUuids(element, "input");
    const memory = generatedTag("Wrk_EdgeMemory");
    const pulse = generatedTag("Wrk_EdgePulse");
    emit([contact(uuid, false), `${element.type === "OSP" ? "OSR" : "OSF"}(${memory},${pulse})`]);
    return { ...power, conditions: [...power.conditions, `XIC(${pulse})`] };
  };

  const flattenNegatedCoil = (element: Element, power: Power): Power => {
    const [target] = operandUuids(element, "output");
    const rung = generatedTag("Wrk_Rung");
    emit([...power.conditions, `OTE(${rung})`]);
    emit([`XIO(${rung})`, `OTE(${writeOperand(target)})`]);
    return { conditions: [`XIC(${rung})`], hasWrites: false, reads: new Set() };
  };

  /** Studio will not compile a rung that ends without an output. */
  const endsInOutput = (items: string[]): boolean => {
    const last = items[items.length - 1];
    if (last === undefined) return false;
    if (isElement(diagram, last)) {
      const { type } = elements[last];
      return COILS.has(type) || MATH.has(type) || MOVES.has(type);
    }
    return (diagram.branches[last]?.rungs ?? []).every((rung) => endsInOutput(diagram.rungs[rung]?.elements ?? []));
  };

  /** Writes what is left of a rung or path, if it writes anything. Reads alone change nothing. */
  const emitLeftover = (items: string[], end: Power) => {
    if (!end.hasWrites) return;
    emit(endsInOutput(items) ? end.conditions : [...end.conditions, `OTE(${generatedTag("Wrk_RungEnd")})`]);
  };

  const overlaps = (a: Set<string>, b: Set<string>) => [...a].some((unit) => b.has(unit));

  /**
   * A branch holding a timer or counter becomes one rung per path, in the order the simulator
   * runs them. The power into it and each path's result stay plain text wherever reading them
   * later still gives what they were in place, and get a tag only where it would not: a write
   * would run again, or a later path changes what they read.
   */
  const flattenBranch = (branchUuid: string, before: Power, resultUsed: boolean): Power => {
    const paths = (diagram.branches[branchUuid]?.rungs ?? []).map((rung) => diagram.rungs[rung]?.elements ?? []);
    const changes = paths.map((path) => effectsOf(path).changes);

    // Every path starts from the power into the branch, so it is read once per path.
    const power =
      before.hasWrites || changes.some((changed) => overlaps(before.reads, changed))
        ? pinned(before, "Wrk_Power")
        : before;

    const results: string[] = [];
    let reads = new Set<string>();
    paths.forEach((path, index) => {
      const end = flatten(path, { ...power, conditions: [...power.conditions] }, resultUsed);
      if (!resultUsed) {
        emitLeftover(path, end);
        return;
      }
      // Read at the end of the branch, a path's result must not depend on a later path.
      const changedLater = union(...changes.slice(index + 1));
      if (!end.hasWrites && !overlaps(end.reads, changedLater)) {
        results.push(end.conditions.join(" "));
        reads = union(reads, end.reads);
        return;
      }
      const tag = generatedTag("Wrk_Path");
      emit([...end.conditions, `OTE(${tag})`]);
      results.push(`XIC(${tag})`);
    });

    // Nothing after the branch reads it, so there is nothing to hand on.
    if (!resultUsed) return { conditions: [], hasWrites: false, reads: new Set() };
    return { conditions: [`[${results.join(", ")}]`], hasWrites: false, reads };
  };

  /** `resultUsed` says whether anything after these items reads the power they end with. */
  const flatten = (items: string[], start: Power, resultUsed: boolean): Power => {
    let power = start;
    items.forEach((uuid, index) => {
      if (!isElement(diagram, uuid)) {
        power = needsFlattening([uuid])
          ? flattenBranch(uuid, power, resultUsed || index < items.length - 1)
          : {
              conditions: [...power.conditions, inPlaceText([uuid])],
              hasWrites: power.hasWrites || writes([uuid]),
              reads: union(power.reads, readsOf([uuid])),
            };
        return;
      }
      const element = elements[uuid];
      if (TIMERS.has(element.type)) power = flattenTimer(element, power);
      else if (COUNTERS.has(element.type)) power = flattenCounter(element, power);
      else if (element.type === "OSP" || element.type === "OSN") power = flattenEdge(element, power);
      else if (element.type === "OTN") power = flattenNegatedCoil(element, power);
      else {
        power = {
          conditions: [...power.conditions, inPlace(element)],
          hasWrites: power.hasWrites || writes([uuid]),
          reads: union(power.reads, readsOf([uuid])),
        };
      }
    });
    return power;
  };

  for (const rungUuid of diagram.runglist) {
    const rung = diagram.rungs[rungUuid];
    if (!rung) continue;
    if (rung.comment) notes.add("Rung comments are not carried over.");
    if (rung.elements.length === 0) continue;

    if (!needsFlattening(rung.elements)) {
      const text = inPlaceText(rung.elements);
      emit(endsInOutput(rung.elements) ? [text] : [text, `OTE(${generatedTag("Wrk_RungEnd")})`]);
      continue;
    }

    // Nothing after a rung's end reads its power.
    emitLeftover(rung.elements, flatten(rung.elements, { conditions: [], hasWrites: false, reads: new Set() }, false));
  }

  return { rungsText: renderFile(tags, output), tags, notes: [...notes] };
}

const yamlText = (text: string) => JSON.stringify(text);

function renderTag(tag: ConvertedTag, isParameter: boolean): string[] {
  // Quoted because a variable can be called `Null` or `Yes`, which YAML would read as a value.
  const lines = [`    - name: ${yamlText(tag.name)}`];
  if (tag.description) lines.push(`      description: ${yamlText(tag.description)}`);
  if (isParameter) lines.push(`      usage: ${tag.usage}`);
  lines.push(`      dataType: ${tag.dataType}`);
  if (typeof tag.defaultValue === "number") lines.push(`      defaultValue: ${tag.defaultValue}`);
  else if (tag.defaultValue) {
    lines.push("      defaultValue:");
    for (const [member, value] of Object.entries(tag.defaultValue)) lines.push(`        ${member}: ${value}`);
  }
  return lines;
}

function renderFile(tags: ConvertedTag[], rungs: string[]): string {
  const parameters = tags.filter((tag) => tag.usage !== "local");
  const locals = tags.filter((tag) => tag.usage === "local");
  return [
    "version: 6",
    "aoi:",
    `  name: ${AOI_NAME}`,
    `  description: ${yamlText("Brought over from PLC Simulator Online.")}`,
    ...(parameters.length > 0 ? ["  parameters:", ...parameters.flatMap((tag) => renderTag(tag, true))] : []),
    ...(locals.length > 0 ? ["  localTags:", ...locals.flatMap((tag) => renderTag(tag, false))] : []),
    "  routines:",
    "    Logic:",
    "      type: ld",
    "      content: |-",
    ...rungs.map((rung) => `        ${rung}`),
    "",
  ].join("\n");
}
