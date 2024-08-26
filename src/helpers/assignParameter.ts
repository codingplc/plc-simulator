import { Store } from "../interface";

export const assignParameter = (index: number, type: string, variableUuid: string, draft: Store) => {
  const setElementConfigured = () => {
    for (const group in element.parameters) {
      for (const parameter of element.parameters[group]) {
        if (!parameter.uuid) return false;
      }
    }
    return true;
  };
  const elementUuid = draft.temp.selectedUuid;
  const element = draft.elements[elementUuid];
  const oldVariableUuid = draft.elements[elementUuid].parameters[type][index].uuid;
  if (oldVariableUuid) {
    if (draft.variables[oldVariableUuid]) {
      draft.variables[oldVariableUuid].usedBy = draft.variables[oldVariableUuid].usedBy.filter(
        (element) => element !== elementUuid
      );
    }
  }
  draft.elements[elementUuid].parameters[type][index].uuid = variableUuid;

  draft.variables[variableUuid].usedBy.push(elementUuid);
  element.configured = setElementConfigured();
  return draft;
};
