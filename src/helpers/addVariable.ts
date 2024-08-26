import { Variable } from '../interface';
import { BOOL, COUNTER, NUMBER, TIME, TIMER } from '../consts/variables';
import { nanoid } from 'nanoid';

export const addVariable = (name: string, type: string) => {
  const createVariables = (
    name: string,
    type: string,
    value: boolean | number | null,
    subVars: [string, string, boolean | number][],
  ): { [key: string]: Variable } => {
    const uuid = nanoid();
    let newVariables: { [key: string]: Variable } = {};
    newVariables[uuid] = {
      name,
      parrent: '',
      type,
      value,
      usedBy: [],
      subVars: {},
    };
    subVars.forEach((subVar) => {
      const [subName, subType, subValue] = subVar;
      const subUuid = nanoid();
      newVariables[uuid].subVars[subName] = subUuid;
      newVariables = {
        ...newVariables,
        [subUuid]: {
          name: `${name}.${subName}`,
          parrent: uuid,
          type: subType,
          usedBy: [],
          value: subValue,
          subVars: {},
        },
      };
    });
    return newVariables;
  };
  switch (type) {
    case BOOL:
      return createVariables(name, type, false, []);
    case COUNTER:
      return createVariables(name, type, null, [
        ['PV', NUMBER, 0],
        ['CV', NUMBER, 0],
        ['CU', BOOL, false],
        ['CD', BOOL, false],
        ['R', BOOL, false],
        ['LD', BOOL, false],
        ['QU', BOOL, false],
        ['QD', BOOL, false],
      ]);
    case TIME:
      return createVariables(name, type, 0, []);
    case NUMBER:
      return createVariables(name, type, 0, []);
    case TIMER:
      return createVariables(name, type, null, [
        ['PT', TIME, 0],
        ['ET', TIME, 0],
        ['IN', BOOL, false],
        ['R', BOOL, false],
        ['Q', BOOL, false],
      ]);
    default:
      console.warn(`No case addVar() for ${type}`);
  }
};
