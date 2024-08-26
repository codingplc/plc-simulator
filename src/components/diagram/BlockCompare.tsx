import { EQU, NEQ, GRT, GEQ, LES, LEQ } from '../../consts/elementTypes';
import { Box, Typography } from '@mui/material';
import MiddleLineBox from './block-components/MiddleLineBox';
import BlockVarName from './block-components/BlockVarName';
import {
  COMPARE_HEIGHT,
  CONTACT_SYMBOL_WIDTH,
  MID_CELL_HEIGHT,
  PARAM_FONT_SIZE,
} from '../../consts/blockDimensions';
import { CompareType, ElementParameters, Store } from '../../interface';
import { useSelector } from 'react-redux';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: CompareType;
}

export default function BlockCompare({ fill, parameters, type }: Props) {
  const input1Id = parameters?.input[0].uuid;
  const input2Id = parameters?.input[1].uuid;
  const { name: name1, value: value1 } =
    useSelector((state: Store) => state.variables[input1Id]) ?? {};
  const { name: name2, value: value2 } =
    useSelector((state: Store) => state.variables[input2Id]) ?? {};
  const simulation = useSelector((state: Store) => state.temp.simulation);

  return (
    <Box
      sx={{
        display: 'inline-grid',
        gridTemplateColumns: 'min-content minmax(min-content, 1.5em) min-content',
        gridTemplateRows: `1em 1.5em ${MID_CELL_HEIGHT} 1.5em 1em`,
      }}
    >
      {simulation && typeof value1 === 'number' && <VarValue row={1} value={value1} />}
      <BlockVarName columnStart={1} columnEnd={4} row={2} name={name1} />
      <MiddleLineBox color={fill} columnStart={1} columnEnd={2} row={3} />
      <Box
        sx={{
          gridColumn: 2,
          gridRow: 3,
          height: COMPARE_HEIGHT,
          width: '2em',
          borderRight: `solid ${CONTACT_SYMBOL_WIDTH} ${fill}`,
          borderLeft: `solid ${CONTACT_SYMBOL_WIDTH} ${fill}`,
          marginTop: `calc((${MID_CELL_HEIGHT} - ${COMPARE_HEIGHT})/2)`,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          color: fill,
          fontSize: '1.25em',
          fontWeight: 'bold',
          gridColumn: 2,
          gridRow: 3,
          justifyContent: 'center',
          letterSpacing: 0,
          lineHeight: '1em',
        }}
      >
        {type === EQU && '=='}
        {type === NEQ && '<>'}
        {type === GRT && '>'}
        {type === GEQ && '>='}
        {type === LES && '<'}
        {type === LEQ && '<='}
      </Box>
      <MiddleLineBox color={fill} columnStart={3} columnEnd={4} row={3} />
      <BlockVarName columnStart={1} columnEnd={4} row={4} name={name2} />
      {simulation && typeof value2 === 'number' && <VarValue row={5} value={value2} />}
    </Box>
  );
}

const VarValue: React.FC<{ row: number; value: number }> = ({ row, value }) => {
  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'flex',
        gridColumn: '1 / 4',
        gridRow: row,
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          fontSize: PARAM_FONT_SIZE,
          lineHeight: 1.25,
          margin: '0 0.25em',
          padding: '0 0.125em',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};
