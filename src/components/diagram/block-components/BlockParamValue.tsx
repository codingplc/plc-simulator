import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { PARAM_FONT_SIZE } from '../../../consts/blockDimensions';
import { ELEMENT, ELEMENT_NOT_CFG, OUT_ON } from '../../../consts/colors';
import { useSelector } from 'react-redux';
import { Store } from '../../../interface';

interface Props {
  column: number;
  isRequired?: boolean;
  varName?: string;
  justify: 'left' | 'right';
  row: number;
  value: number | boolean | null;
}

export default function BlockParamValue({
  column,
  isRequired,
  justify,
  row,
  value,
  varName,
}: Props) {
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const name = varName === undefined && isRequired ? '<???>' : varName;
  const stringValue = typeof value === 'boolean' ? value.toString() : value;

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: justify === 'left' ? 'row' : 'row-reverse',
        gridColumn: column,
        gridRow: row,
        justifyContent: justify,
        minWidth: typeof value === 'boolean' ? '3.75em' : 'auto',
      }}
    >
      <Box
        alignSelf="end"
        sx={{
          bgcolor:
            typeof value === 'boolean' ? (value && simulation ? OUT_ON : ELEMENT) : 'darkgrey',
          marginBottom: `calc((${PARAM_FONT_SIZE} + 0.25em) / 2)`,
          height: '0.25em',
          width: '1em',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: justify === 'left' ? 'flex-start' : 'flex-end',
        }}
      >
        {(simulation || !varName) && (
          <Typography
            sx={{
              backgroundColor: varName ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
              color: stringValue === '<???>' ? ELEMENT_NOT_CFG : ELEMENT,
              fontSize: PARAM_FONT_SIZE,
              lineHeight: 1.25,
              margin: '0 0.25em',
              padding: '0 0.125em',
            }}
          >
            {stringValue}
          </Typography>
        )}
        <Typography
          color={varName ? ELEMENT : ELEMENT_NOT_CFG}
          fontSize={PARAM_FONT_SIZE}
          fontWeight="medium"
          m="0 0.25em"
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
}
