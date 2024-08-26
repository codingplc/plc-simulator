import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RungDropResult, Store } from '../../interface';
import { ELEMENT, OUT_ON, SELECTED } from '../../consts/colors';
import { OTE, OTL, OTN, OTU } from '../../consts/elementTypes';
import { DROP_RUNG } from '../../store/types';
import Branch from './Branch';
import DraggableBlock from './DraggableBlock';
import Wire from './Wire';
import { Box } from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
import { RUNG, TOOL_RUNG } from '../../consts/itemTypes';
import PowerRail from './PowerRail';
import RungHelp from './RungHelp';
import { nanoid } from 'nanoid';

interface Props {
  index: number;
  mobileUI: boolean;
  uuid: string;
}

export default function Rung({ index, mobileUI, uuid }: Props) {
  const dispatch = useDispatch();
  const { elements, out } = useSelector((state: Store) => state.rungs[uuid]);
  const diagramElements = useSelector((state: Store) => state.elements);
  const diagramBranches = useSelector((state: Store) => state.branches);
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const selected = selectedUuid === uuid;
  const fillLeft = simulation ? OUT_ON : selected ? SELECTED : ELEMENT;
  const fillRight = simulation ? (out ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
  const rungElementTypes = elements.map((rungElement) => diagramElements[rungElement]?.type);
  const coils = [OTE, OTL, OTU, OTN];
  const lastCoilGrpIndex = rungElementTypes.map((type) => (coils.includes(type) ? 'coil' : null)).lastIndexOf(null);
  const indexedElements = elements.map((element, index) => ({ element, blockIndex: index }));
  indexedElements.splice(lastCoilGrpIndex + 1, 0, {
    element: 'WIRE',
    blockIndex: lastCoilGrpIndex + 1,
  });
  const elementBeforeWire = elements[lastCoilGrpIndex];
  const elementBeforeWireOut = Object.keys(diagramBranches).includes(elementBeforeWire)
    ? diagramBranches[elementBeforeWire].out
    : Object.keys(diagramElements).includes(elementBeforeWire)
    ? diagramElements[elementBeforeWire].out
    : true;
  const wireColor = simulation ? (elementBeforeWireOut ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
  const displayRungHelp = index === 0 && elements.length === 0 && !mobileUI;
  const isOnlyElementOf1stRung = index === 0 && elements.length === 1;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: RUNG,
      item: {},
      end: (item, monitor) => {
        const dropResult: RungDropResult | null = monitor.getDropResult();
        if (item && dropResult) {
          const { dropIndex } = dropResult;
          return dispatch({
            type: DROP_RUNG,
            payload: { dragRungId: uuid, dragIndex: index, dropIndex },
          });
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [uuid, index],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [RUNG, TOOL_RUNG],
      drop: (): RungDropResult => ({
        dropIndex: index,
      }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      canDrop: () => {
        return !isDragging;
      },
    }),
    [index, uuid, elements, isDragging],
  );

  const combinedRef = (node: HTMLElement) => {
    drag(node);
    drop(node);
  };

  const getComponentName = (elementUuid: string) => {
    if (Object.keys(diagramBranches).includes(elementUuid)) return Branch;
    if (Object.keys(diagramElements).includes(elementUuid)) return DraggableBlock;
    return Wire;
  };

  const handleOnCLick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    return dispatch({
      type: 'SELECT_OBJECT',
      payload: { uuid },
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: isOver && !isDragging ? 'rgba(236, 158, 20, 0.2)' : 'transparent',
        display: 'flex',
        marginBottom: '0.25em',
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        outline: 'none',
      }}
      onClick={(e) => handleOnCLick(e)}
      ref={combinedRef}
    >
      <PowerRail elementsLength={elements.length} fillColor={fillLeft} position={'left'} rungId={uuid} />
      <Box
        sx={{
          display: 'flex',
          py: '0.25em',
          minWidth: 'calc(100% - 0.5em)',
          flexShrink: 0,
        }}
      >
        {indexedElements.map(({ element, blockIndex }, index) => {
          const Component = getComponentName(element);
          return (
            <Component
              key={nanoid()}
              blockIndex={blockIndex}
              isOnlyElementOf1stRung={isOnlyElementOf1stRung}
              flexIndex={index}
              uuid={element}
              parrentSelected={selected}
              parrentId={uuid}
              color={wireColor}
            />
          );
        })}
      </Box>
      <PowerRail elementsLength={elements.length} fillColor={fillRight} position={'right'} rungId={uuid} />
      {displayRungHelp && <RungHelp />}
    </Box>
  );
}
