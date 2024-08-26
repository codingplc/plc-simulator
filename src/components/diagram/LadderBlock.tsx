import { useSelector } from 'react-redux';
import { Store } from '../../interface';
import { DROP_HIGHLIGHT, ELEMENT, OUT_ON, SELECTED } from '../../consts/colors';
import * as ELEMENTS from '../../consts/elementTypes';
import Coil from './BlockCoil';
import Compare from './BlockCompare';
import Contact from './BlockContact';
import Counter from './BlockCounter';
import Math from './BlockMath';
import Move from './BlockMove';
import Timer from './BlockTimer';
import BlockHelp from './BlockHelp';

interface Props {
  isOnlyElementOf1stRung: boolean;
  isOver: boolean;
  parrentSelected: boolean;
  toolboxType?: string;
  uuid: string;
}

export default function LadderBlock({ isOnlyElementOf1stRung, isOver, parrentSelected, toolboxType, uuid }: Props) {
  const element = useSelector((state: Store) => state.elements[uuid]);
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const { configured, out, parameters, type } = element ?? { type: toolboxType };
  const selected = selectedUuid === uuid || parrentSelected;
  const isCoil = type === ELEMENTS.OTE || type === ELEMENTS.OTL || type === ELEMENTS.OTU;
  const displayHelp = selectedUuid === uuid && !configured && !isCoil && isOnlyElementOf1stRung;
  const fill = simulation ? (out ? OUT_ON : ELEMENT) : isOver ? DROP_HIGHLIGHT : selected ? SELECTED : ELEMENT;
  return (
    <>
      {(() => {
        switch (type) {
          case ELEMENTS.OTE:
          case ELEMENTS.OTL:
          case ELEMENTS.OTU:
          case ELEMENTS.OTN:
            return <Coil fill={fill} parameters={parameters} type={type} />;
          case ELEMENTS.XIO:
          case ELEMENTS.XIC:
          case ELEMENTS.OSP:
          case ELEMENTS.OSN:
            return <Contact fill={fill} parameters={parameters} type={type} />;
          case ELEMENTS.CTD:
          case ELEMENTS.CTU:
          case ELEMENTS.CTUD:
            return <Counter fill={fill} parameters={parameters} type={type} />;
          case ELEMENTS.TOF:
          case ELEMENTS.TON:
          case ELEMENTS.TONR:
            return <Timer fill={fill} parameters={parameters} type={type} />;
          case ELEMENTS.ADD:
          case ELEMENTS.SUB:
          case ELEMENTS.MUL:
          case ELEMENTS.DIV:
            return <Math fill={fill} parameters={parameters} type={type} />;
          case ELEMENTS.EQU:
          case ELEMENTS.NEQ:
          case ELEMENTS.GRT:
          case ELEMENTS.GEQ:
          case ELEMENTS.LES:
          case ELEMENTS.LEQ:
            return <Compare parameters={parameters} fill={fill} type={type} />;
          case ELEMENTS.MOV:
          case ELEMENTS.MOVE:
            return <Move parameters={parameters} fill={fill} type={type} />;
          default:
            console.warn(`There is no block component for ${type}`);
            return null;
        }
      })()}
      {displayHelp && <BlockHelp />}
    </>
  );
}
