import { Branch, Rungs } from "../interface";

export const findParrentRung = (selectedUuid: string, rungs: Rungs) =>
  Object.keys(rungs).find((rungUuid) => selectedUuid === rungUuid)
    ? selectedUuid
    : Object.keys(rungs).find((rungUuid) => rungs[rungUuid].elements.find((element) => element === selectedUuid));

export const newBranch = (rungUuid1: string, rungUuid2: string): Branch => ({
  rungs: [rungUuid1, rungUuid2],
  input: false,
  out: false,
});
