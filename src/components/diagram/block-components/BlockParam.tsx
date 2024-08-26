import { FbParam } from '../../../interface';
import BlockParamDesc from './BlockParamDesc';
import BlockParamValue from './BlockParamValue';

interface Props {
  param: FbParam;
  position: 'in' | 'out';
  row: number;
}

export default function BlockParam({ param, position, row }: Props) {
  const descColumn = position === 'in' ? 2 : 4;
  const valueColumn = position === 'in' ? 1 : 5;
  const justifyDesc = position === 'in' ? 'left' : 'right';
  const justifyValue = position === 'in' ? 'right' : 'left';
  return (
    <>
      <BlockParamDesc desc={param.desc} column={descColumn} row={row} justify={justifyDesc} />
      <BlockParamValue
        value={param.value}
        column={valueColumn}
        isRequired={param.isRequired}
        varName={param.varName}
        row={row}
        justify={justifyValue}
      />
    </>
  );
}
