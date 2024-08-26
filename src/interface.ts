import { AlertColor } from '@mui/material';

export interface Branch {
  rungs: string[];
  input: boolean;
  out: boolean;
}
export interface Diagram {
  branches: {
    [key: string]: Branch;
  };
  runglist: string[];
  elements: Elements;
  rungs: { [key: string]: Rung };
  variables: { [key: string]: Variable };
}
export interface Element {
  configured: boolean;
  out: boolean;
  parameters: ElementParameters;
  type: string;
}
export interface Elements {
  [key: string]: ElementCoil | ElementCompare | ElementContact | ElementCounter | ElementMath | ElementMove | ElementTimer;
}
export type ElementsAll = ElementCoil | ElementCompare | ElementContact | ElementCounter | ElementMath | ElementMove | ElementTimer;
export interface ElementCoil extends Element {
  type: CoilType;
}
export interface ElementCompare extends Element {
  type: CompareType;
}
export interface ElementContact extends Element {
  type: ContactType;
  memInput: boolean;
}
export interface ElementCounter extends Element {
  memInput: boolean;
  prevCU: boolean;
  prevCD: boolean;
  type: CounterType;
}
export interface ElementMath extends Element {
  type: MathType;
}
export interface ElementMove extends Element {
  type: MoveType;
}
export interface ElementParameter {
  type: string[];
  uuid: string;
}
export interface ElementParameters {
  [key: string]: ElementParameter[];
}
export interface ElementTimer extends Element {
  type: TimerType;
}
export interface Rung {
  comment: string;
  elements: string[];
  input: boolean;
  out: boolean;
}

export type Rungs = {
  [key: string]: Rung;
};

export interface Store extends Diagram {
  misc: { displayTab: string };
  temp: {
    alertSnackbar: { color: AlertColor; open: boolean; text: string };
    canUndo: boolean;
    canRedo: boolean;
    diagramSaved: boolean;
    openElementProps: boolean;
    simulation: boolean;
    selectedUuid: string;
  };
}

export interface Variable {
  name: string;
  parrent: string;
  subVars: { [key: string]: string };
  type: string;
  usedBy: string[];
  value: boolean | number | null;
}
export interface VariableOption {
  label: string;
  value: string;
}

export type CounterType = 'CTU' | 'CTD' | 'CTUD';
export type CoilType = 'OTE' | 'OTL' | 'OTU' | 'OTN';
export type ContactType = 'XIC' | 'XIO' | 'OSP' | 'OSN';
export type CompareType = 'EQU' | 'NEQ' | 'GRT' | 'GEQ' | 'LES' | 'LEQ';
export type MathType = 'ADD' | 'SUB' | 'MUL' | 'DIV';
export type TimerType = 'TOF' | 'TON' | 'TONR';
export type MoveType = 'MOV' | 'MOVE';

export type FbParam = { desc: string; varName?: string; isRequired?: boolean; value: boolean | number | null };
export type FbParams = (FbParam | null)[];

export type ElementDropResult = { type: string; dropId: string; dropIndex: number; dropRungId: string };
export type RungDropResult = { dropIndex: number };
