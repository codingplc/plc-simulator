import { nanoid } from 'nanoid';
import { NEW_RUNG } from '../consts/ladderObjects';
import { Store } from '../interface';
import { findParrentRung } from './simulationObjects';

export const addRung = (draft: Store, dropIndex: number | undefined): Store => {
  const newRungUuid = nanoid();
  draft.rungs[newRungUuid] = NEW_RUNG;
  const { selectedUuid } = draft.temp;
  const parrentRungUuid = findParrentRung(selectedUuid, draft.rungs);
  const startIndex = typeof dropIndex === 'number' ? dropIndex : draft.runglist.findIndex((rungUuid) => rungUuid === parrentRungUuid);
  draft.runglist.splice(startIndex + 1, 0, newRungUuid);
  draft.temp.selectedUuid = newRungUuid;
  return draft;
};
