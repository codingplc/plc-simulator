import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../interface';
import { ELEMENT, OUT_ON, SELECTED } from '../../consts/colors';
import Branch from './Branch';
import DraggableBlock from './DraggableBlock';
import Wire from './Wire';
import { Box } from '@mui/material';
import { MID_CELL_HEIGHT, TYPE_HEIGHT, VAR_HEIGHT } from '../../consts/blockDimensions';
import { nanoid } from 'nanoid';

interface Props {
  fillLeft: string;
  fillRight: string;
  uuid: string;
  parrentSelected: boolean;
  position: 'top' | 'bottom' | 'middle';
}

export default function BranchRung(props: Props) {
  const { uuid, fillLeft, fillRight, parrentSelected, position } = props;
  const dispatch = useDispatch();
  const rung = useSelector((state: Store) => state.rungs[uuid]);
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const diagramElements = useSelector((state: Store) => state.elements);
  const { elements, out } = rung;
  const selected = selectedUuid === uuid || parrentSelected;
  const wireColor = simulation ? (out ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;

  const getComponentName = (elementUuid: string) => {
    if (Object.keys(diagramElements).includes(elementUuid)) return DraggableBlock;
    else return Branch;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '4em',
        minWidth: '4em',
        flexShrink: 0,
      }}
      onClick={(e) => {
        e.stopPropagation();
        return dispatch({
          type: 'SELECT_OBJECT',
          payload: { uuid },
        });
      }}
    >
      <Box
        sx={{
          backgroundColor: fillLeft,
          flexShrink: 0,
          marginTop: position === 'top' ? `calc(${TYPE_HEIGHT} + ${VAR_HEIGHT} - 0.125em + (${MID_CELL_HEIGHT} / 2))` : 0,
          height: position === 'bottom' ? `calc(${TYPE_HEIGHT} + ${VAR_HEIGHT} + 0.125em + (${MID_CELL_HEIGHT} / 2))` : 'auto',
          width: '0.25em',
        }}
      />

      {elements.map((blockId: string, index) => {
        const Component = getComponentName(blockId);
        return (
          <Component
            key={nanoid()}
            blockIndex={index}
            isOnlyElementOf1stRung={false}
            uuid={blockId}
            parrentId={uuid}
            parrentSelected={selected || parrentSelected}
          />
        );
      })}
      <Wire color={wireColor} flexIndex={elements.length + 1} parrentId={uuid} />
      <Box
        sx={{
          backgroundColor: fillRight,
          flexShrink: 0,
          marginTop: position === 'top' ? `calc(${TYPE_HEIGHT} + ${VAR_HEIGHT} - 0.125em + (${MID_CELL_HEIGHT} / 2))` : 0,
          height: position === 'bottom' ? `calc(${TYPE_HEIGHT} + ${VAR_HEIGHT} + 0.125em + (${MID_CELL_HEIGHT} / 2))` : 'auto',
          width: '0.25em',
        }}
      />
    </Box>
  );
}
