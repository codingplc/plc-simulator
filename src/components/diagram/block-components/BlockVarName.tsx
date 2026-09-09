import { ELEMENT, ELEMENT_NOT_CFG } from '../../../consts/colors';
import { Box, Typography } from '@mui/material';

interface Props {
  columnStart: number;
  columnEnd: number;
  row: number;
  name: string | undefined | null;
}

export default function BlockVarName({ columnStart, columnEnd, name, row }: Props) {
  if (name === null) return null;
  return (
    <Box
      sx={{
        gridColumnStart: columnStart,
        gridColumnEnd: columnEnd,
        gridRow: row,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '16em',
          padding: '0 0.5em',
          height: '100%',
        }}
      >
        <Typography
          color={name === undefined ? ELEMENT_NOT_CFG : ELEMENT}
          noWrap
          sx={{
            fontWeight: name === undefined ? 'bold' : 'medium',
            fontSize: '0.875em',
          }}
        >
          {name === undefined ? '<???>' : name}
        </Typography>
      </Box>
    </Box>
  );
}
