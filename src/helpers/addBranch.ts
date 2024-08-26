import { nanoid } from 'nanoid';
import { OTE, OTL, OTU } from '../consts/elementTypes';
import { NEW_RUNG } from '../consts/ladderObjects';
import { Diagram, Store } from '../interface';
import { findParrentRung, newBranch } from './simulationObjects';

export default function addBranch(draft: Store, targetId: string): Store {
  const isRung = Object.prototype.hasOwnProperty.call(draft.rungs, targetId);
  const isElement = Object.prototype.hasOwnProperty.call(draft.elements, targetId);
  if (isRung) {
    const branchId = findBranchId(draft, targetId);
    if (branchId) {
      const rungIndex = draft.branches[branchId].rungs.findIndex((rung) => rung === targetId);
      const newRungUuid1 = nanoid();
      draft.rungs[newRungUuid1] = JSON.parse(JSON.stringify(NEW_RUNG));
      draft.branches[branchId].rungs.splice(rungIndex + 1, 0, newRungUuid1);
      draft.temp.selectedUuid = newRungUuid1;
    } else {
      const newRungUuid1 = nanoid();
      draft.rungs[newRungUuid1] = JSON.parse(JSON.stringify(NEW_RUNG));
      const newRungUuid2 = nanoid();
      draft.rungs[newRungUuid2] = JSON.parse(JSON.stringify(NEW_RUNG));
      const newBranchUuid = nanoid();
      draft.branches[newBranchUuid] = newBranch(newRungUuid1, newRungUuid2);
      const elementIds = draft.rungs[targetId].elements;
      const elementTypes = elementIds.map((elementId) => draft.elements[elementId]?.type);
      const coils = [OTE, OTL, OTU];
      const lastCoilIndex = elementTypes.map((type) => (coils.includes(type) ? 'coil' : null)).lastIndexOf(null);
      elementIds.splice(lastCoilIndex + 1, 0, newBranchUuid);
      draft.temp.selectedUuid = newRungUuid2;
    }
  } else if (isElement) {
    const parrentRung = findParrentRung(targetId, draft.rungs);
    if (parrentRung) {
      const branchId = findBranchId(draft, parrentRung);
      if (branchId && draft.rungs[parrentRung].elements.length < 2) {
        const rungIndex = draft.branches[branchId].rungs.findIndex((rung) => rung === parrentRung);
        const newRungUuid1 = nanoid();
        draft.rungs[newRungUuid1] = JSON.parse(JSON.stringify(NEW_RUNG));
        draft.branches[branchId].rungs.splice(rungIndex + 1, 0, newRungUuid1);
        draft.temp.selectedUuid = newRungUuid1;
      } else {
        const elements = draft.rungs[parrentRung].elements;
        const newRungUuid1 = nanoid();
        draft.rungs[newRungUuid1] = JSON.parse(JSON.stringify(NEW_RUNG));
        const newRungUuid2 = nanoid();
        draft.rungs[newRungUuid2] = JSON.parse(JSON.stringify(NEW_RUNG));
        const newBranchUuid = nanoid();
        draft.branches[newBranchUuid] = newBranch(newRungUuid1, newRungUuid2);
        const elementIndex = elements.findIndex((element) => element === targetId);
        draft.rungs[newRungUuid1].elements.push(...elements.splice(elementIndex, 1, newBranchUuid));
        draft.temp.selectedUuid = newRungUuid2;
      }
    }
  }
  return draft;
}

function findBranchId(diagram: Diagram, id: string): string | null {
  for (const branchId in diagram.branches) {
    if (diagram.branches[branchId].rungs.includes(id)) {
      return branchId;
    }
  }
  return null;
}
