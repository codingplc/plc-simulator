import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { PARAM_FONT_SIZE } from '../../../consts/blockDimensions';

interface Props {
  desc: string;
  column: number;
  justify: 'left' | 'right';
  row: number;
}

export default function BlockParamDesc({ column, justify, desc, row }: Props) {
  return (
    <Box
      sx={{
        alignItems: 'end',
        display: 'flex',
        justifyContent: justify,
        gridColumn: column,
        gridRow: row,
        margin: '0 0.25em',
      }}
    >
      <Typography fontSize={PARAM_FONT_SIZE}>{desc}</Typography>
    </Box>
  );
}
