import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { TYPE_FONT_SIZE, TYPE_HEIGHT } from '../../../consts/blockDimensions';

interface Props {
  type: string;
}

export default function BlockType({ type }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gridColumnStart: 2,
        gridColumnEnd: 5,
        gridRow: 2,
        justifyContent: 'center',
        height: TYPE_HEIGHT,
        padding: '0 0.375em',
      }}
    >
      <Typography color={'#FFFFFF'} fontWeight={'medium'} fontSize={TYPE_FONT_SIZE}>
        {type}
      </Typography>
    </Box>
  );
}
