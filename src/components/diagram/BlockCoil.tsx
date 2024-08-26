import { useSelector } from 'react-redux';
import { CoilType, ElementParameters, Store } from '../../interface';
import { ELEMENT, OUT_ON } from '../../consts/colors';
import { OTL, OTU, OTN } from '../../consts/elementTypes';
import BlockVariableName from './block-components/BlockVarName';
import { Box } from '@mui/material';
import { COIL_HEIGHT, COIL_SYMBOL_WIDTH, MID_CELL_HEIGHT } from '../../consts/blockDimensions';
import MiddleLineBox from './block-components/MiddleLineBox';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: CoilType;
}

export default function BlockCoil({ fill, parameters, type }: Props) {
  const outputID = parameters?.output[0].uuid;
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const variable = useSelector((state: Store) => state.variables[outputID]);
  const coilFill = simulation ? (variable?.value ? OUT_ON : ELEMENT) : fill;
  return (
    <Box
      sx={{
        display: 'inline-grid',
        gridTemplateColumns: 'min-content minmax(min-content, 1.75em) min-content',
        gridTemplateRows: `1em 1.5em ${MID_CELL_HEIGHT}`,
      }}
    >
      <BlockVariableName columnStart={1} columnEnd={4} row={2} name={variable?.name} />
      <MiddleLineBox color={fill} columnStart={1} columnEnd={2} row={3} />
      <Box
        sx={{
          gridColumn: 2,
          gridRow: 3,
          height: COIL_HEIGHT,
          width: '1.75em',
          borderBottom: `solid ${COIL_SYMBOL_WIDTH} transparent`,
          borderTop: `solid ${COIL_SYMBOL_WIDTH} transparent`,
          borderRight: `solid ${COIL_SYMBOL_WIDTH} ${coilFill}`,
          borderLeft: `solid ${COIL_SYMBOL_WIDTH} ${coilFill}`,
          borderRadius: '50%',
          marginTop: `calc((${MID_CELL_HEIGHT} - ${COIL_HEIGHT})/2)`,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          color: coilFill,
          fontSize: '1.25em',
          fontWeight: 'bold',
          gridColumn: 2,
          gridRow: 3,
          justifyContent: 'center',
          lineHeight: '1em',
        }}
      >
        {type === OTL && 'S'}
        {type === OTU && 'R'}
        {type === OTN && '/'}
      </Box>
      <MiddleLineBox color={fill} columnStart={3} columnEnd={4} row={3} />
    </Box>
  );
}
