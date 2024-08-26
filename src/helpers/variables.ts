import { Variable, VariableOption } from "../interface";

export const filterByType = (variables: { [key: string]: Variable }, searchType: string[]): VariableOption[] => {
  const reducer = (accumulator: any, currentUuid: string) => [
    ...accumulator,
    { value: currentUuid, label: variables[currentUuid].name },
  ];
  return Object.keys(variables)
    .filter((uuid) => searchType.includes(variables[uuid].type))
    .reduce(reducer, []);
};
