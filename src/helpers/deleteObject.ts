import { Store } from "../interface";
import { addRung } from "./addRung";

export const deleteObject = (objectUuid: string, draft: Store): Store => {
  const { runglist, elements } = draft;
  return Object.keys(elements).includes(objectUuid)
    ? deleteElement(objectUuid, draft)
    : runglist.includes(objectUuid)
      ? deleteRung(objectUuid, draft)
      : deleteBranchRung(objectUuid, draft);
};

const deleteBranch = (branchUuid: string, draft: Store): Store => {
  for (const uuid of draft.branches[branchUuid].rungs) {
    deleteRung(uuid, draft);
  }
  Object.keys(draft.rungs).map(
    (rung) => (draft.rungs[rung].elements = draft.rungs[rung].elements.filter((element) => element !== branchUuid))
  );
  delete draft.branches[branchUuid];
  return draft;
};

const deleteBranchRung = (rungId: string, draft: Store): Store => {
  const { branches, rungs } = draft;
  const parrentBranchId = Object.keys(branches).find((branch) => branches[branch].rungs.includes(rungId));
  if (parrentBranchId) {
    branches[parrentBranchId].rungs = branches[parrentBranchId].rungs.filter((rung) => rung !== rungId);
    const parrentRungId = Object.keys(rungs).find((rung) => rungs[rung].elements.includes(parrentBranchId));
    deleteRung(rungId, draft);
    if (parrentRungId) {
      draft.temp.selectedUuid = parrentRungId;
      if (branches[parrentBranchId].rungs.length === 1) {
        const remainingRungId = branches[parrentBranchId].rungs[0];
        const remainingElements = rungs[remainingRungId].elements;
        const parentBranchIndex = rungs[parrentRungId].elements.findIndex((element) => element === parrentBranchId);
        draft.rungs[parrentRungId].elements = rungs[parrentRungId].elements.filter((element) => element !== parrentBranchId);
        draft.rungs[parrentRungId].elements.splice(parentBranchIndex, 0, ...remainingElements);
        delete draft.branches[parrentBranchId];
        delete draft.rungs[remainingRungId];
        draft.temp.selectedUuid = parrentRungId;
      }
    }
  }
  return draft;
};

const deleteElement = (elementUuid: string, draft: Store): Store => {
  const { rungs, variables } = draft;
  const parrentRung = Object.keys(rungs).find((rungUuid) =>
    rungs[rungUuid].elements.find((element) => element === elementUuid)
  );
  const elementParameters = draft.elements[elementUuid]?.parameters;
  if (!elementParameters) return draft;
  Object.keys(elementParameters).map((group) =>
    elementParameters[group].map((variable) => {
      if (variable.uuid) {
        if (draft.variables[variable.uuid]) {
          draft.variables[variable.uuid].usedBy = variables[variable.uuid].usedBy.filter(
            (element) => element !== elementUuid
          );
        }
      }
    })
  );
  if (parrentRung) {
    draft.rungs[parrentRung].elements = rungs[parrentRung].elements.filter((element) => element !== elementUuid);
    delete draft.elements[elementUuid];
    reduceBranch(parrentRung, draft);
    draft.temp.selectedUuid = parrentRung;
  }
  return draft;
};

export const reduceBranch = (rungId: string, draft: Store): Store => {
  const { branches, rungs } = draft;
  if (rungs[rungId].elements.length === 1) {
    const lastElement = draft.rungs[rungId].elements[0];
    const lastElementIsBranch = Object.keys(branches).includes(lastElement);
    const parrentBranchId = Object.keys(branches).find((branch) => branches[branch].rungs.includes(rungId));
    if (parrentBranchId && lastElement && lastElementIsBranch) {
      const parrentRungIndex = branches[parrentBranchId].rungs.findIndex((rung) => rung === rungId);
      branches[parrentBranchId].rungs.splice(parrentRungIndex, 0, ...branches[lastElement].rungs);
      branches[parrentBranchId].rungs = branches[parrentBranchId].rungs.filter((rung) => rung !== rungId);
      delete draft.branches[lastElement];
      delete draft.rungs[rungId];
    }
  }
  return draft;
};

const deleteRung = (rungUuid: string, draft: Store): Store => {
  const { branches, elements, runglist, rungs } = draft;
  for (const uuid of draft.rungs[rungUuid].elements) {
    if (Object.keys(branches).includes(uuid)) deleteBranch(uuid, draft);
    if (Object.keys(elements).includes(uuid)) deleteElement(uuid, draft);
  }
  draft.runglist = runglist.filter((rung) => rung !== rungUuid);
  Object.keys(branches).map(
    (branch) => (branches[branch].rungs = branches[branch].rungs.filter((rung) => rung !== rungUuid))
  );
  delete rungs[rungUuid];
  !draft.runglist[0] && addRung(draft, undefined);
  draft.temp.selectedUuid = draft.runglist[0];
  return draft;
};
