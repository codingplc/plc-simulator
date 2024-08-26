import { Box } from '@mui/material';
import { FB_GRID_TMPL_COLS, MID_CELL_HEIGHT, TYPE_HEIGHT, VAR_HEIGHT } from '../../../consts/blockDimensions';
import { FbParams } from '../../../interface';
import BlockVarName from './BlockVarName';
import BlockInOut from './BlockInOut';
import BlockType from './BlockType';
import { BLOCK_PARAM_BG } from '../../../consts/colors';
import BlockParam from './BlockParam';
import { nanoid } from 'nanoid';

interface Props {
  blockVarName: string | undefined | null;
  fill: string;
  inOutNames: [string, string];
  params: { in: FbParams; out: FbParams };
  type: string;
}

export default function FunctionBlock(props: Props) {
  const { blockVarName, fill, inOutNames, params, type } = props;
  const { in: inParams, out: outParams } = params;
  const paramsCount = Math.max(inParams.length, outParams.length);
  const rows = 4 + paramsCount;
  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'inline-grid',
        gridTemplateColumns: FB_GRID_TMPL_COLS,
        gridTemplateRows: `${VAR_HEIGHT} ${TYPE_HEIGHT} ${MID_CELL_HEIGHT} repeat(${paramsCount}, min-content)`,
      }}
    >
      <Box
        sx={{
          backgroundColor: fill,
          gridColumn: '2 / 5',
          gridRow: `2 / ${rows}`,
        }}
      />
      <Box
        sx={{
          gridColumn: '2 / 5',
          gridRow: `4 / ${rows}`,
          backgroundColor: BLOCK_PARAM_BG,
          width: '100%',
        }}
      />
      <BlockVarName columnStart={1} columnEnd={6} row={1} name={blockVarName} />
      <BlockType type={type} />
      <BlockInOut inName={inOutNames[0]} outName={inOutNames[1]} fill={fill} />
      {inParams.map((param, index) => param !== null && <BlockParam key={nanoid()} param={param} row={4 + index} position="in" />)}
      {outParams.map((param, index) => param !== null && <BlockParam key={nanoid()} param={param} row={4 + index} position="out" />)}
    </Box>
  );
}
