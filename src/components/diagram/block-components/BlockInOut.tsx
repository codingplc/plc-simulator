import { Box } from '@mui/material';
import MiddleLineBox from './MiddleLineBox';
import BlockParamDesc from './BlockParamDesc';
import { BLOCK_PARAM_BG } from '../../../consts/colors';

interface Props {
  inName: string;
  outName: string;
  fill: string;
}

export default function BlockInOut({ inName, outName, fill }: Props) {
  return (
    <>
      <MiddleLineBox color={fill} columnStart={1} columnEnd={2} row={3} />
      <Box
        sx={{
          gridColumn: '2 / 5',
          gridRow: 3,
          backgroundColor: BLOCK_PARAM_BG,
        }}
      />
      <BlockParamDesc column={2} justify="left" row={3} desc={inName} />
      <BlockParamDesc column={4} justify="right" row={3} desc={outName} />
      <MiddleLineBox color={fill} columnStart={5} columnEnd={6} row={3} />
    </>
  );
}
