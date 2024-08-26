import { Box } from '@mui/material';
import {
  RUNG_LINE_WIDTH,
  MID_CELL_HEIGHT,
  VAR_HEIGHT,
  TYPE_HEIGHT,
} from '../../consts/blockDimensions';
import { useDrop } from 'react-dnd';
import { BLOCK, BRANCH, WIRE } from '../../consts/itemTypes';
import { ElementDropResult } from '../../interface';
import { DROP_HIGHLIGHT } from '../../consts/colors';

interface Props {
  color: string;
  flexIndex: number;
  parrentId: string;
}

export default function Wire({ color, flexIndex, parrentId }: Props) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [BLOCK, BRANCH],
      drop: (): ElementDropResult => ({
        type: WIRE,
        dropId: parrentId,
        dropRungId: parrentId,
        dropIndex: flexIndex,
      }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [color, flexIndex, parrentId],
  );

  return (
    <Box
      ref={drop}
      sx={{
        display: 'grid',
        gridTemplateRows: 'repeat(3, min-content)',
        width: '100%',
      }}
    >
      <Box
        sx={{
          gridColumn: 1,
          gridRow: 1,
          minHeight: `calc(${VAR_HEIGHT} + ${TYPE_HEIGHT})`,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          gridColumn: 1,
          gridRow: 2,
          height: MID_CELL_HEIGHT,
        }}
      >
        <Box
          sx={{
            backgroundColor: isOver ? DROP_HIGHLIGHT : color,
            height: RUNG_LINE_WIDTH,
            marginY: 'auto',
            width: '100%',
          }}
        />
      </Box>
      <Box
        sx={{
          gridColumn: 1,
          gridRow: 3,
          minHeight: VAR_HEIGHT,
        }}
      />
    </Box>
  );
}
