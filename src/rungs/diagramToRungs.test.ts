import { describe, expect, it } from "vitest";

import { addVariable } from "../helpers/addVariable";
import type { Diagram, Element, Variable } from "../interface";
import { diagramToRungs } from "./diagramToRungs";

/** Builds a diagram from one rung, given as element specs, with named variables. */
function diagramOf(
  declared: [name: string, type: string][],
  elements: { type: string; parameters: Record<string, string[]> }[],
): Diagram {
  const variables: Record<string, Variable> = {};
  const uuidOf = (name: string) => {
    const [parent, member] = name.split(".");
    const found = Object.entries(variables).find(([, variable]) => variable.name === parent);
    if (!found) return "";
    return member ? found[1].subVars[member] : found[0];
  };
  for (const [name, type] of declared) Object.assign(variables, addVariable(name, type));

  const built: Record<string, Element> = {};
  elements.forEach(({ type, parameters }, index) => {
    built[`e${index}`] = {
      configured: true,
      out: false,
      type,
      parameters: Object.fromEntries(
        Object.entries(parameters).map(([group, names]) => [
          group,
          names.map((name) => ({ type: [], uuid: uuidOf(name) })),
        ]),
      ),
    };
    for (const names of Object.values(parameters)) {
      for (const name of names) {
        const uuid = uuidOf(name);
        if (variables[uuid]) variables[uuid].usedBy.push(`e${index}`);
      }
    }
  });
  return {
    branches: {},
    elements: built as Diagram["elements"],
    runglist: ["r"],
    rungs: { r: { comment: "", elements: Object.keys(built), input: false, out: false } },
    variables,
  };
}

const logicOf = (diagram: Diagram) => {
  const { rungsText } = diagramToRungs(diagram);
  return rungsText
    .slice(rungsText.indexOf("content: |-") + "content: |-".length)
    .trim()
    .split("\n")
    .map((line) => line.trim());
};

describe("diagramToRungs", () => {
  it("writes contacts and coils in place", () => {
    const diagram = diagramOf(
      [
        ["Start", "Bool"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["Start"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );

    expect(logicOf(diagram)).toEqual(["XIC(Start) OTE(Lamp);"]);
  });

  it("moves logic after a timer to a rung that reads its done bit", () => {
    const diagram = diagramOf(
      [
        ["Start", "Bool"],
        ["Delay", "Timer"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["Start"] } },
        { type: "TOF", parameters: { inOut: ["Delay"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );

    const delay = Object.values(diagram.variables).find((variable) => variable.name === "Delay");
    if (delay) diagram.variables[delay.subVars.PT].value = 2000;

    expect(logicOf(diagram)).toEqual(["XIC(Start) TOF(Delay,?,?);", "XIC(Delay.DN) OTE(Lamp);"]);
  });

  it("makes a rung that ends without an output compile", () => {
    const diagram = diagramOf([["Start", "Bool"]], [{ type: "XIC", parameters: { input: ["Start"] } }]);

    expect(logicOf(diagram)).toEqual(["XIC(Start) OTE(Wrk_RungEnd);"]);
  });

  it("writes a constant as a number", () => {
    const diagram = diagramOf(
      [
        ["1000", "Number"],
        ["Total", "Number"],
      ],
      [{ type: "MOV", parameters: { input: ["1000"], output: ["Total"] } }],
    );
    const constant = Object.values(diagram.variables).find((variable) => variable.name === "1000");
    if (constant) constant.value = 1000;

    expect(logicOf(diagram)).toEqual(["MOVE(1000,Total);"]);
  });

  it("uses a REAL for a result that keeps its fraction", () => {
    const diagram = diagramOf(
      [
        ["A", "Number"],
        ["Result", "Number"],
      ],
      [{ type: "DIV", parameters: { input: ["A", "A"], output: ["Result"] } }],
    );

    expect(diagramToRungs(diagram).tags.find((tag) => tag.name === "Result")?.dataType).toBe("REAL");
  });

  it("renames an invalid tag and keeps the old name as its description", () => {
    const diagram = diagramOf(
      [
        ["Start Button", "Bool"],
        ["I0.0", "Bool"],
        ["IF", "Bool"],
        ["start_button", "Bool"],
      ],
      [],
    );
    const { tags } = diagramToRungs(diagram);

    expect(tags.map(({ name, description }) => [name, description])).toEqual([
      ["Start_Button", "Start Button"],
      ["I0_0", "I0.0"],
      ["IF_Tag", "IF"],
      ["start_button_2", "start_button"],
    ]);
  });

  it("tells a program's own reads and writes apart for tag usage", () => {
    const diagram = diagramOf(
      [
        ["Start", "Bool"],
        ["Lamp", "Bool"],
        ["Spare", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["Start"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );

    expect(diagramToRungs(diagram).tags.map(({ name, usage }) => [name, usage])).toEqual([
      ["Start", "input"],
      ["Lamp", "output"],
      ["Spare", "local"],
    ]);
  });

  it("marks a block with no variable for Studio, without a note", () => {
    const diagram = diagramOf(
      [["Lamp", "Bool"]],
      [
        { type: "XIC", parameters: { input: ["Missing"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );

    expect(logicOf(diagram)).toEqual(["XIC(?) OTE(Lamp);"]);
    expect(diagramToRungs(diagram).notes).toEqual([]);
  });

  it("marks a timer with no variable the same way", () => {
    const diagram = diagramOf([["Start", "Bool"]], [
      { type: "XIC", parameters: { input: ["Start"] } },
      { type: "TON", parameters: { inOut: ["Missing"] } },
    ]);

    expect(logicOf(diagram)).toEqual(["XIC(Start) TON(?,?,?);"]);
    expect(diagramToRungs(diagram).notes).toEqual([]);
  });

  it("adds a reset tag only when the program uses the reset", () => {
    const diagram = diagramOf(
      [
        ["Unused", "Timer"],
        ["Keeps", "Timer"],
        ["Clear", "Bool"],
      ],
      [
        { type: "TONR", parameters: { inOut: ["Unused"] } },
        { type: "TONR", parameters: { inOut: ["Keeps"] } },
        { type: "XIC", parameters: { input: ["Clear"] } },
        { type: "OTE", parameters: { output: ["Keeps.R"] } },
      ],
    );

    expect(diagramToRungs(diagram).tags.map((tag) => tag.name)).toEqual(["Unused", "Keeps", "Keeps_R", "Clear"]);
  });

  it("quotes a name YAML would otherwise read as a value", () => {
    const diagram = diagramOf([["Null", "Bool"]], []);

    expect(diagramToRungs(diagram).rungsText).toContain('- name: "Null"');
  });

  it("treats a timer with a preset of 0 as always done, as the simulator does", () => {
    const diagram = diagramOf(
      [
        ["Start", "Bool"],
        ["Delay", "Timer"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["Start"] } },
        { type: "TON", parameters: { inOut: ["Delay"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );

    expect(logicOf(diagram)).toEqual(["XIC(Start) TON(Delay,?,?);", "GE(Delay.ACC,Delay.PRE) OTE(Lamp);"]);
  });

  it("keeps a timer's done bit as the timer left it when the program writes its preset", () => {
    const diagram = diagramOf(
      [
        ["Start", "Bool"],
        ["Delay", "Timer"],
        ["Lamp", "Bool"],
        ["Zero", "Number"],
        ["Long", "Number"],
      ],
      [
        { type: "XIC", parameters: { input: ["Start"] } },
        { type: "TON", parameters: { inOut: ["Delay"] } },
        { type: "MOVE", parameters: { input: ["Zero"], output: ["Delay.PT"] } },
        { type: "XIC", parameters: { input: ["Delay.Q"] } },
        { type: "OTL", parameters: { output: ["Lamp"] } },
        { type: "MOVE", parameters: { input: ["Long"], output: ["Delay.PT"] } },
      ],
    );
    const timer = Object.values(diagram.variables).find((variable) => variable.name === "Delay")!;
    diagram.variables[timer.subVars.PT].value = 1000;
    diagram.rungs.r.elements = ["e0", "e1"];
    diagram.rungs.r2 = { comment: "", elements: ["e2"], input: false, out: false };
    diagram.rungs.r3 = { comment: "", elements: ["e3", "e4"], input: false, out: false };
    diagram.rungs.r4 = { comment: "", elements: ["e5"], input: false, out: false };
    diagram.runglist = ["r", "r2", "r3", "r4"];

    // The preset is 0 only between the timer and the contact, so Lamp stays off in the
    // simulator. The tag holds what the timer decided when it ran, with a preset of 0 or not.
    expect(logicOf(diagram)).toEqual([
      "XIC(Start) TON(Delay,?,?);",
      "[XIC(Delay.DN), EQ(Delay.PRE,0)] OTE(Delay_Q);",
      "MOVE(Zero,Delay.PRE);",
      "XIC(Delay_Q) OTL(Lamp);",
      "MOVE(Long,Delay.PRE);",
    ]);
  });

  it("treats the parts of a timer no block runs as plain bits", () => {
    const diagram = diagramOf(
      [
        ["Stop", "Bool"],
        ["Unused", "Timer"],
        ["Motor", "Bool"],
      ],
      [{ type: "XIC", parameters: { input: ["Stop"] } }, { type: "OTE", parameters: { output: ["Unused.Q"] } }],
    );
    diagram.runglist.push("r2");
    diagram.rungs.r2 = { comment: "", elements: ["e2", "e3"], input: false, out: false };
    const q = Object.values(diagram.variables).find((variable) => variable.name === "Unused")?.subVars.Q ?? "";
    const motor = Object.keys(diagram.variables).find((uuid) => diagram.variables[uuid].name === "Motor") ?? "";
    diagram.elements.e2 = { configured: true, out: false, type: "XIC", parameters: { input: [{ type: [], uuid: q }] } } as never;
    diagram.elements.e3 = { configured: true, out: false, type: "OTE", parameters: { output: [{ type: [], uuid: motor }] } } as never;

    expect(logicOf(diagram)).toEqual(["XIC(Stop) OTE(Unused_Q);", "XIC(Unused_Q) OTE(Motor);"]);
  });

  it("keeps a branch holding a timer as a plain branch when no path writes", () => {
    const diagram = diagramOf(
      [
        ["Delay", "Timer"],
        ["Off", "Bool"],
        ["Run", "Bool"],
        ["Clear", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["Run"] } },
        { type: "TON", parameters: { inOut: ["Delay"] } },
        { type: "XIO", parameters: { input: ["Off"] } },
        { type: "OTE", parameters: { output: ["Clear"] } },
      ],
    );
    const delay = Object.values(diagram.variables).find((variable) => variable.name === "Delay");
    if (delay) diagram.variables[delay.subVars.PT].value = 5000;
    diagram.rungs.p1 = { comment: "", elements: ["e0", "e1"], input: false, out: false };
    diagram.rungs.p2 = { comment: "", elements: ["e2"], input: false, out: false };
    diagram.branches.b = { rungs: ["p1", "p2"], input: false, out: false };
    diagram.rungs.r.elements = ["b", "e3"];

    expect(logicOf(diagram)).toEqual(["XIC(Run) TON(Delay,?,?);", "[XIC(Delay.DN), XIO(Off)] OTE(Clear);"]);
  });

  it("holds a path's result before a later path runs the timer it read", () => {
    const diagram = diagramOf(
      [
        ["Delay", "Timer"],
        ["Run", "Bool"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["Delay.Q"] } },
        { type: "XIC", parameters: { input: ["Run"] } },
        { type: "TON", parameters: { inOut: ["Delay"] } },
        { type: "XIO", parameters: { input: ["Run"] } },
        { type: "OTL", parameters: { output: ["Lamp"] } },
      ],
    );
    const delay = Object.values(diagram.variables).find((variable) => variable.name === "Delay");
    if (delay) diagram.variables[delay.subVars.PT].value = 5000;
    diagram.rungs.p1 = { comment: "", elements: ["e0"], input: false, out: false };
    diagram.rungs.p2 = { comment: "", elements: ["e1", "e2"], input: false, out: false };
    diagram.branches.b = { rungs: ["p1", "p2"], input: false, out: false };
    diagram.rungs.r.elements = ["b", "e3", "e4"];

    // The first path reads Delay before the second runs it, as in the simulator.
    expect(logicOf(diagram)).toEqual([
      "XIC(Delay.DN) OTE(Wrk_Path);",
      "XIC(Run) TON(Delay,?,?);",
      "[XIC(Wrk_Path), XIC(Delay.DN)] XIO(Run) OTL(Lamp);",
    ]);
  });

  it("writes a branch of timers as plain rungs when nothing reads its result", () => {
    const diagram = diagramOf(
      [
        ["Red", "Bool"],
        ["Yellow", "Bool"],
        ["On", "Timer"],
        ["Off", "Timer"],
        ["Next", "Timer"],
      ],
      [
        { type: "OTL", parameters: { output: ["Red"] } },
        { type: "TON", parameters: { inOut: ["On"] } },
        { type: "TOF", parameters: { inOut: ["Off"] } },
        { type: "OTU", parameters: { output: ["Red"] } },
        { type: "OTL", parameters: { output: ["Yellow"] } },
        { type: "TON", parameters: { inOut: ["Next"] } },
      ],
    );
    for (const name of ["On", "Off", "Next"]) {
      const timer = Object.values(diagram.variables).find((variable) => variable.name === name)!;
      diagram.variables[timer.subVars.PT].value = 1000;
    }
    diagram.rungs.p1 = { comment: "", elements: ["e2", "e3"], input: false, out: false };
    diagram.rungs.p2 = { comment: "", elements: ["e4", "e5"], input: false, out: false };
    diagram.branches.b = { rungs: ["p1", "p2"], input: false, out: false };
    diagram.rungs.r.elements = ["e0", "e1", "b"];

    // Each path starts from the timer's done bit, which no path changes.
    expect(logicOf(diagram)).toEqual([
      "OTL(Red) TON(On,?,?);",
      "XIC(On.DN) TOF(Off,?,?);",
      "XIC(Off.DN) OTU(Red);",
      "XIC(On.DN) OTL(Yellow) TON(Next,?,?);",
    ]);
  });

  it("keeps the writes before a timer another rung already ran", () => {
    const diagram = diagramOf(
      [
        ["Delay", "Timer"],
        ["Start", "Bool"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "TON", parameters: { inOut: ["Delay"] } },
        { type: "XIC", parameters: { input: ["Start"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
        { type: "TON", parameters: { inOut: ["Delay"] } },
      ],
    );
    const delay = Object.values(diagram.variables).find((variable) => variable.name === "Delay");
    if (delay) diagram.variables[delay.subVars.PT].value = 5000;
    diagram.rungs.r.elements = ["e0"];
    diagram.rungs.r2 = { comment: "", elements: ["e1", "e2", "e3"], input: false, out: false };
    diagram.runglist = ["r", "r2"];

    // The second block only reads the timer, so the rung is a write followed by a contact.
    expect(logicOf(diagram)).toEqual([
      "TON(Delay,?,?);",
      "XIC(Start) OTE(Lamp) XIC(Delay.DN) OTE(Wrk_RungEnd);",
    ]);
  });

  it("reads a counter's output as the counter left it, not from the count now", () => {
    const diagram = diagramOf(
      [
        ["Count", "Counter"],
        ["In", "Bool"],
        ["Lamp", "Bool"],
        ["One", "Number"],
        ["Zero", "Number"],
      ],
      [
        { type: "MOVE", parameters: { input: ["One"], output: ["Count.CV"] } },
        { type: "XIC", parameters: { input: ["In"] } },
        { type: "CTU", parameters: { inOut: ["Count"] } },
        { type: "MOVE", parameters: { input: ["Zero"], output: ["Count.CV"] } },
        { type: "XIC", parameters: { input: ["Count.QU"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );
    diagram.rungs.r.elements = ["e0"];
    diagram.rungs.r2 = { comment: "", elements: ["e1", "e2"], input: false, out: false };
    diagram.rungs.r3 = { comment: "", elements: ["e3"], input: false, out: false };
    diagram.rungs.r4 = { comment: "", elements: ["e4", "e5"], input: false, out: false };
    diagram.runglist = ["r", "r2", "r3", "r4"];

    expect(logicOf(diagram)).toEqual([
      "MOVE(One,Count.ACC);",
      "XIC(In) CTU(Count,?,?);",
      "GE(Count.ACC,Count.PRE) OTE(Count_QU);",
      "MOVE(Zero,Count.ACC);",
      "XIC(Count_QU) OTE(Lamp);",
    ]);
  });

  it("keeps a timer part the program writes as one bit the timer sets too", () => {
    const diagram = diagramOf(
      [
        ["Run", "Bool"],
        ["Delay", "Timer"],
        ["Stop", "Bool"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["Run"] } },
        { type: "TON", parameters: { inOut: ["Delay"] } },
        { type: "XIC", parameters: { input: ["Stop"] } },
        { type: "OTU", parameters: { output: ["Delay.IN"] } },
        { type: "XIC", parameters: { input: ["Delay.IN"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );
    const delay = Object.values(diagram.variables).find((variable) => variable.name === "Delay")!;
    diagram.variables[delay.subVars.PT].value = 5000;
    diagram.rungs.r.elements = ["e0", "e1"];
    diagram.rungs.r2 = { comment: "", elements: ["e2", "e3"], input: false, out: false };
    diagram.rungs.r3 = { comment: "", elements: ["e4", "e5"], input: false, out: false };
    diagram.runglist = ["r", "r2", "r3"];

    // The read gets the program's write when that came last, as in the simulator.
    expect(logicOf(diagram)).toEqual([
      "XIC(Run) TON(Delay,?,?);",
      "XIC(Delay.EN) OTE(Delay_IN);",
      "XIC(Stop) OTU(Delay_IN);",
      "XIC(Delay_IN) OTE(Lamp);",
    ]);
    expect(diagramToRungs(diagram).notes).toEqual([]);
  });

  it("notes that a counter with nothing before it never counts in Studio", () => {
    const diagram = diagramOf(
      [
        ["Count", "Counter"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "CTU", parameters: { inOut: ["Count"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );

    expect(logicOf(diagram)).toEqual(["CTU(Count,?,?);", "GE(Count.ACC,Count.PRE) OTE(Lamp);"]);
    expect(diagramToRungs(diagram).notes.join(" ")).toContain("never in Rungs Studio");
  });

  it("reads a counter's output by comparing its count while only the counter changes it", () => {
    const diagram = diagramOf(
      [
        ["In", "Bool"],
        ["Count", "Counter"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "XIC", parameters: { input: ["In"] } },
        { type: "CTU", parameters: { inOut: ["Count"] } },
        { type: "XIC", parameters: { input: ["Count.QU"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );
    diagram.rungs.r.elements = ["e0", "e1"];
    diagram.rungs.r2 = { comment: "", elements: ["e2", "e3"], input: false, out: false };
    diagram.runglist = ["r", "r2"];

    expect(logicOf(diagram)).toEqual(["XIC(In) CTU(Count,?,?);", "GE(Count.ACC,Count.PRE) OTE(Lamp);"]);
    expect(diagramToRungs(diagram).notes).toEqual([]);
  });

  it("notes that a program reading an off-delay timer's time counts the other way", () => {
    const diagram = diagramOf(
      [
        ["Delay", "Timer"],
        ["Limit", "Number"],
        ["Lamp", "Bool"],
      ],
      [
        { type: "TOF", parameters: { inOut: ["Delay"] } },
        { type: "GRT", parameters: { input: ["Delay.ET", "Limit"] } },
        { type: "OTE", parameters: { output: ["Lamp"] } },
      ],
    );

    expect(diagramToRungs(diagram).notes.join(" ")).toContain("counts up");
  });

  it("does not put the saved state of a written BOOL in the file", () => {
    const diagram = diagramOf([["Lamp", "Bool"]], [{ type: "OTE", parameters: { output: ["Lamp"] } }]);
    Object.values(diagram.variables)[0].value = true;

    expect(diagramToRungs(diagram).tags[0].defaultValue).toBeUndefined();
  });
});
