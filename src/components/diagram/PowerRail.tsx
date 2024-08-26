import { ElementDropResult } from '../../interface';
import { Box } from '@mui/material';
import { POWER_RAIL_WIDTH } from '../../consts/blockDimensions';
import { useDrop } from 'react-dnd';
import { BLOCK } from '../../consts/itemTypes';
import { DROP_HIGHLIGHT } from '../../consts/colors';

interface Props {
  elementsLength: number;
  fillColor: string;
  position: 'left' | 'right';
  rungId: string;
}

export default function PowerRail({ elementsLength, fillColor, position, rungId }: Props) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [BLOCK],
      drop: (): ElementDropResult => ({
        type: 'POWER_RAIL',
        dropId: '',
        dropIndex: position === 'left' ? 0 : elementsLength,
        dropRungId: rungId,
      }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [],
  );

  return (
    <Box
      sx={{
        bgcolor: isOver ? DROP_HIGHLIGHT : fillColor,
        flexShrink: 0,
        width: POWER_RAIL_WIDTH,
        position: 'relative',
      }}
    >
      <Box
        ref={drop}
        sx={{
          position: 'absolute',
          top: 0,
          left: '-0.25em',
          right: '-0.25em',
          bottom: 0,
        }}
      ></Box>
    </Box>
  );
}
