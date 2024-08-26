import { Store } from "../interface";

export const deleteVariable = (variableUuid: string, draft: Store) => {
  const removeFromElement = (variableUuid: string) => {
    draft.variables[variableUuid].usedBy.forEach((elementUuid) => {
      Object.keys(draft.elements[elementUuid]?.parameters)?.forEach((parameterGroup) => {
        const variableIndex = draft.elements[elementUuid].parameters[parameterGroup].findIndex(
          (parameter) => parameter.uuid === variableUuid
        );
        if (variableIndex !== -1) {
          draft.elements[elementUuid].parameters[parameterGroup][variableIndex].uuid = "";
          draft.elements[elementUuid].configured = false;
        }
      });
    });
  };

  if (draft.variables[variableUuid].subVars) {
    Object.values(draft.variables[variableUuid].subVars).forEach((subUuid) => {
      removeFromElement(subUuid);
      delete draft.variables[subUuid];
    });
  }
  removeFromElement(variableUuid);
  delete draft.variables[variableUuid];
  return draft;
};
