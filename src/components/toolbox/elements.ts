import { ADD, CTU, EQU, MOVE, OTE, TON, XIC } from '../../consts/elementTypes';
import { BOOL, COUNTER, NUMBER, TIME, TIMER } from '../../consts/variables';
import {
  ElementCoil,
  ElementCompare,
  ElementContact,
  ElementCounter,
  ElementMath,
  ElementMove,
  ElementTimer,
} from '../../interface';

export const coil: ElementCoil = {
  configured: false,
  out: false,
  parameters: {
    output: [{ type: [BOOL], uuid: '' }],
  },
  type: OTE,
};

export const compare: ElementCompare = {
  configured: false,
  out: false,
  parameters: {
    input: [
      { type: [NUMBER, TIME], uuid: '' },
      { type: [NUMBER, TIME], uuid: '' },
    ],
  },
  type: EQU,
};

export const contact: ElementContact = {
  configured: false,
  memInput: false,
  out: false,
  parameters: {
    input: [{ type: [BOOL], uuid: '' }],
  },
  type: XIC,
};

export const counter: ElementCounter = {
  configured: false,
  prevCU: false,
  prevCD: false,
  memInput: false,
  out: false,
  parameters: {
    inOut: [{ type: [COUNTER], uuid: '' }],
  },
  type: CTU,
};

export const math: ElementMath = {
  configured: false,
  out: false,
  parameters: {
    input: [
      { type: [NUMBER, TIME], uuid: '' },
      { type: [NUMBER, TIME], uuid: '' },
    ],
    output: [{ type: [NUMBER, TIME], uuid: '' }],
  },
  type: ADD,
};

export const move: ElementMove = {
  configured: false,
  out: false,
  parameters: {
    input: [{ type: [NUMBER, TIME], uuid: '' }],
    output: [{ type: [NUMBER, TIME], uuid: '' }],
  },
  type: MOVE,
};

export const timer: ElementTimer = {
  configured: false,
  type: TON,
  out: false,
  parameters: {
    inOut: [{ type: [TIMER], uuid: '' }],
  },
};
