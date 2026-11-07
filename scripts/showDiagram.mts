/** Prints what the converter makes of named diagrams, for reading a comparison failure. */
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { diagramToRungs } from "../src/rungs/diagramToRungs";

const [file, ...ids] = process.argv.slice(2);
for await (const line of createInterface({ input: createReadStream(file) })) {
  const { id, diagram } = JSON.parse(line);
  if (!ids.includes(id)) continue;
  const text = diagramToRungs(diagram).rungsText;
  console.log("=====", id);
  console.log(text.slice(text.indexOf("content: |-")));
  console.log(Object.values(diagram.elements).map((e: any) => e.type).join(" "));
}
