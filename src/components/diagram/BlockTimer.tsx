import { useSelector } from 'react-redux';
import { ElementParameters, Store, TimerType } from '../../interface';

import FunctionBlock from './block-components/FunctionBlock';
import { TONR } from '../../consts/elementTypes';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: TimerType;
}

export default function BlockTimer({ parameters, fill, type }: Props) {
  const inOutID = parameters?.inOut[0].uuid;
  const variable = useSelector((state: Store) => state.variables[inOutID]);
  const { name } = variable ?? { name: undefined };
  const { PT, ET, R } = variable?.subVars ?? {};
  const ptValue = useSelector((state: Store) => state.variables[PT]?.value);
  const etValue = useSelector((state: Store) => state.variables[ET]?.value);
  const rValue = useSelector((state: Store) => state.variables[R]?.value);
  const inParams = [
    ...(type === TONR ? [{ desc: 'R', value: rValue }] : []),
    { desc: 'PT', value: ptValue },
  ];
  const outParams = [...(type === TONR ? [null] : []), { desc: 'ET', value: etValue }];
  const params = { in: inParams, out: outParams };

  return (
    <FunctionBlock
      blockVarName={name}
      fill={fill}
      inOutNames={['IN', 'Q']}
      params={params}
      type={type}
    />
  );
}
