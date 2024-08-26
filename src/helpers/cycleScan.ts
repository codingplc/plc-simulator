import * as ELEMENT_TYPES from '../consts/elementTypes';
import { ElementContact, ElementCompare, ElementCounter, ElementMath, ElementTimer, ElementCoil, Store, ElementMove } from '../interface';
import { CYCLE_TIME } from '../consts/consts';
import { Variable } from '../interface';
import { NUMBER_MAX, NUMBER_MIN } from '../consts/variables';

export const cycleScan = (draft: Store): Store => {
  const { branches, elements, rungs } = draft;
  const branchOut = (branchId: string, RLO: boolean) => {
    const branch = draft.branches[branchId];
    branch.input = RLO;
    let rungsRLO = false;
    for (const rung of branch.rungs) {
      if (rungOut(rung, RLO)) rungsRLO = true;
    }
    branch.out = rungsRLO;
    return branch.out;
  };
  const elementOut = (elementId: string, RLO: boolean) => {
    const element = elements[elementId];
    const simulation = draft.temp.simulation;
    const variables = draft.variables;
    const type = element.type;
    switch (element.type) {
      case ELEMENT_TYPES.OTE:
      case ELEMENT_TYPES.OTL:
      case ELEMENT_TYPES.OTU:
      case ELEMENT_TYPES.OTN:
        return setCoilOut(element, RLO, variables);
      case ELEMENT_TYPES.XIO:
      case ELEMENT_TYPES.XIC:
      case ELEMENT_TYPES.OSP:
      case ELEMENT_TYPES.OSN:
        return setContactOut(element, RLO, variables);
      case ELEMENT_TYPES.CTD:
        return setCtdOut(element, RLO, variables);
      case ELEMENT_TYPES.CTU:
        return setCtuOut(element, RLO, variables);
      case ELEMENT_TYPES.CTUD:
        return setCtudOut(element, RLO, variables);
      case ELEMENT_TYPES.TOF:
      case ELEMENT_TYPES.TON:
      case ELEMENT_TYPES.TONR:
        return setTimerOut(element, RLO, simulation, variables);
      case ELEMENT_TYPES.ADD:
      case ELEMENT_TYPES.SUB:
      case ELEMENT_TYPES.MUL:
      case ELEMENT_TYPES.DIV:
        return setMathOut(element, RLO, variables);
      case ELEMENT_TYPES.MOV:
      case ELEMENT_TYPES.MOVE:
        return setMoveOut(element, RLO, variables);
      case ELEMENT_TYPES.EQU:
      case ELEMENT_TYPES.NEQ:
      case ELEMENT_TYPES.GRT:
      case ELEMENT_TYPES.GEQ:
      case ELEMENT_TYPES.LES:
      case ELEMENT_TYPES.LEQ:
        return setCompareOut(element, RLO, variables);
      default:
        console.warn(`No CYCLE_SCAN case for ${type}`);
        return false;
    }
  };
  const rungOut = (rungUuid: string, RLO: boolean) => {
    const rung = rungs[rungUuid];
    rung.input = RLO;
    for (const element of rung.elements) {
      if (Object.keys(elements).includes(element)) {
        RLO = elementOut(element, RLO);
      } else if (Object.keys(branches).includes(element)) {
        RLO = branchOut(element, RLO);
      }
    }
    rung.out = RLO;
    return rung.out;
  };

  for (const rung of draft.runglist) {
    rungOut(rung, draft.temp.simulation);
  }
  return draft;
};

const setCoilOut = (element: ElementCoil, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const output0 = variables[element.parameters.output[0].uuid];
  if (!output0) return false;
  switch (element.type) {
    case ELEMENT_TYPES.OTE:
      output0.value = RLO;
      break;
    case ELEMENT_TYPES.OTL:
      if (RLO) output0.value = true;
      break;
    case ELEMENT_TYPES.OTU:
      if (RLO) output0.value = false;
      break;
    case ELEMENT_TYPES.OTN:
      output0.value = !RLO;
      break;
    default:
      console.warn(`No case for ${element.type}`);
  }
  element.out = RLO;
  return element.out;
};

const setCompareOut = (element: ElementCompare, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const { input } = element.parameters;
  const input0 = variables[input[0].uuid];
  const input1 = variables[input[1].uuid];
  if (!input0 || !input1) return false;
  if (typeof input0.value !== 'number' || typeof input1.value !== 'number') return false;
  switch (element.type) {
    case ELEMENT_TYPES.EQU:
      element.out = RLO && input0.value === input1.value;
      break;
    case ELEMENT_TYPES.NEQ:
      element.out = RLO && input0.value !== input1.value;
      break;
    case ELEMENT_TYPES.GRT:
      element.out = RLO && input0.value > input1.value;
      break;
    case ELEMENT_TYPES.GEQ:
      element.out = RLO && input0.value >= input1.value;
      break;
    case ELEMENT_TYPES.LES:
      element.out = RLO && input0.value < input1.value;
      break;
    case ELEMENT_TYPES.LEQ:
      element.out = RLO && input0.value <= input1.value;
      break;
    default:
      console.warn(`No case for ${element.type}`);
  }
  return element.out;
};

const setContactOut = (element: ElementContact, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const input0 = variables[element.parameters.input[0].uuid];
  if (!input0) return false;
  if (typeof input0.value !== 'boolean') return false;
  switch (element.type) {
    case ELEMENT_TYPES.XIC:
      element.out = RLO && input0.value;
      break;
    case ELEMENT_TYPES.XIO:
      element.out = RLO && !input0.value;
      break;
    case ELEMENT_TYPES.OSP:
      element.out = RLO && input0.value && !element.memInput;
      break;
    case ELEMENT_TYPES.OSN:
      element.out = RLO && !input0.value && element.memInput;
      break;
    default:
      console.warn(`No case for ${element.type}`);
  }
  element.memInput = input0.value;
  return element.out;
};

const setCtuOut = (element: ElementCounter, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const inOut = variables[element.parameters.inOut[0].uuid];
  const { PV, CV, CU, R, QU } = inOut?.subVars ?? {};
  const pvValue = variables[PV]?.value;
  let cvValue = variables[CV]?.value;
  let cuValue = variables[CU]?.value;
  if (!Object.prototype.hasOwnProperty.call(element, 'prevCU')) {
    element.prevCU = false;
  }
  if (typeof cvValue !== 'number' || typeof pvValue !== 'number' || typeof cuValue !== 'boolean') return false;
  cuValue = RLO;
  const cuEdge = cuValue && !element.prevCU;
  element.prevCU = cuValue;
  if (variables[R].value) {
    cvValue = 0;
  } else if (cuEdge && cvValue < NUMBER_MAX) {
    cvValue += 1;
  }
  element.out = cvValue >= pvValue;
  variables[QU].value = element.out;
  variables[CV].value = cvValue;
  variables[CU].value = cuValue;
  return element.out;
};

const setCtdOut = (element: ElementCounter, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const inOut = variables[element.parameters.inOut[0].uuid];
  const { PV, CV, CD, LD, QD } = inOut?.subVars ?? {};
  const pvValue = variables[PV]?.value;
  let cvValue = variables[CV]?.value;
  let cdValue = variables[CD]?.value;
  if (!Object.prototype.hasOwnProperty.call(element, 'prevCD')) {
    element.prevCD = false;
  }
  if (typeof cvValue !== 'number' || typeof pvValue !== 'number' || typeof cdValue !== 'boolean') return false;
  cdValue = RLO;
  const cdEdge = cdValue && !element.prevCD;
  element.prevCD = cdValue;
  if (variables[LD].value) {
    cvValue = pvValue;
  } else if (cdEdge && cvValue > NUMBER_MIN) {
    cvValue -= 1;
  }
  element.out = cvValue <= 0;
  variables[QD].value = element.out;
  variables[CV].value = cvValue;
  variables[CD].value = cdValue;
  return element.out;
};

const setCtudOut = (element: ElementCounter, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const inOut = variables[element.parameters.inOut[0].uuid];
  const { PV, CV, CU, CD, R, LD, QU, QD } = inOut?.subVars ?? {};
  const pvValue = variables[PV]?.value;
  let cvValue = variables[CV]?.value;
  let cuValue = variables[CU]?.value;
  const cdValue = variables[CD]?.value;
  if (!Object.prototype.hasOwnProperty.call(element, 'prevCU')) {
    element.prevCU = false;
  }
  if (!Object.prototype.hasOwnProperty.call(element, 'prevCD')) {
    element.prevCD = false;
  }
  if (typeof cvValue !== 'number' || typeof pvValue !== 'number' || typeof cuValue !== 'boolean' || typeof cdValue !== 'boolean') return false;
  cuValue = RLO;
  const cuEdge = cuValue && !element.prevCU;
  element.prevCU = cuValue;
  const cdEdge = cdValue && !element.prevCD;
  element.prevCD = cdValue;
  if (variables[R].value) {
    cvValue = 0;
  } else if (variables[LD].value) {
    cvValue = pvValue;
  } else if (!(cuEdge && cdEdge)) {
    if (cuEdge && cvValue < NUMBER_MAX) {
      cvValue += 1;
    }
    if (cdEdge && cvValue > NUMBER_MIN) {
      cvValue -= 1;
    }
  }
  element.out = cvValue >= pvValue;
  variables[QU].value = element.out;
  variables[QD].value = cvValue <= 0;
  variables[CU].value = cuValue;
  variables[CV].value = cvValue;
  return element.out;
};

const setMathOut = (element: ElementMath, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const { input, output } = element.parameters;
  const input0 = variables[input[0].uuid];
  const input1 = variables[input[1].uuid];
  const output0 = variables[output[0].uuid];
  if (!input0 || !input1 || !output) return false;
  if (typeof input0.value !== 'number' || typeof input1.value !== 'number') return false;
  switch (element.type) {
    case ELEMENT_TYPES.ADD:
      RLO && (output0.value = input0.value + input1.value);
      break;
    case ELEMENT_TYPES.SUB:
      RLO && (output0.value = input0.value - input1.value);
      break;
    case ELEMENT_TYPES.MUL:
      RLO && (output0.value = input0.value * input1.value);
      break;
    case ELEMENT_TYPES.DIV:
      RLO && (output0.value = input0.value / input1.value);
      break;
    default:
      console.warn(`No setMathRLO case for ${element.type}`);
  }
  element.out = RLO;
  return element.out;
};

const setMoveOut = (element: ElementMove, RLO: boolean, variables: { [key: string]: Variable }): boolean => {
  const { input, output } = element.parameters;
  const input0 = variables[input[0].uuid];
  const output0 = variables[output[0].uuid];
  if (!input0 || !output) return false;
  if (typeof input0.value !== 'number') return false;
  if (RLO) output0.value = input0.value;
  element.out = RLO;
  return element.out;
};

const setTimerOut = (element: ElementTimer, RLO: boolean, simulation: boolean, variables: { [key: string]: Variable }): boolean => {
  const inOut = variables[element.parameters.inOut[0].uuid];
  if (!inOut?.subVars) return false;
  const { PT, ET, IN, R, Q } = inOut.subVars;
  const { type } = element;
  variables[IN].value = RLO;
  const ptValue = variables[PT].value;
  let etValue = variables[ET].value;
  const inValue = variables[IN].value as boolean;
  const rValue = variables[R].value;
  let qValue = variables[Q].value as boolean;

  if (typeof etValue !== 'number' || typeof ptValue !== 'number') return false;
  if (
    ((!inValue || !simulation) && type === ELEMENT_TYPES.TON) ||
    ((rValue || !simulation) && type === ELEMENT_TYPES.TONR) ||
    (!simulation && type === ELEMENT_TYPES.TOF)
  ) {
    etValue = 0;
  } else if (inValue && type === ELEMENT_TYPES.TOF) {
    etValue = ptValue;
  } else if (inValue && (type === ELEMENT_TYPES.TON || type === ELEMENT_TYPES.TONR)) {
    etValue + CYCLE_TIME > ptValue ? (etValue = ptValue) : (etValue += CYCLE_TIME);
  } else if (!inValue && type === ELEMENT_TYPES.TOF) {
    etValue - CYCLE_TIME <= 0 ? (etValue = 0) : (etValue -= CYCLE_TIME);
  }
  variables[ET].value = etValue;

  switch (type) {
    case ELEMENT_TYPES.TON:
    case ELEMENT_TYPES.TONR:
      qValue = etValue === ptValue;
      break;
    case ELEMENT_TYPES.TOF:
      qValue = (etValue < ptValue && etValue > 0) || inValue;
      break;
  }

  element.out = qValue;
  variables[Q].value = qValue;
  return element.out;
};
