import Box from '@mui/material/Box';
import { RUNG_LINE_WIDTH } from '../../../consts/blockDimensions';

interface Props {
  color: string;
  columnStart: number;
  columnEnd: number;
  row: number;
}

export default function MiddleLineBox({ color, columnStart, columnEnd, row }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        gridColumnStart: columnStart,
        gridColumnEnd: columnEnd,
        gridRow: row,
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: color,
          height: RUNG_LINE_WIDTH,
          marginY: 'auto',
          minWidth: '1em',
          width: '100%',
        }}
      />
    </Box>
  );
}
