import { ElementParameters, MathType, Store } from '../../interface';
import { useSelector } from 'react-redux';
import FunctionBlock from './block-components/FunctionBlock';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: MathType;
}

export default function BlockMath({ fill, parameters, type }: Props) {
  const in1ID = parameters?.input[0].uuid;
  const in2ID = parameters?.input[1].uuid;
  const outID = parameters?.output[0].uuid;
  const in1 = useSelector((state: Store) => state.variables[in1ID]);
  const in2 = useSelector((state: Store) => state.variables[in2ID]);
  const out = useSelector((state: Store) => state.variables[outID]);

  const inParams = [
    { desc: 'IN1', varName: in1?.name, isRequired: true, value: in1?.value },
    { desc: 'IN2', varName: in2?.name, isRequired: true, value: in2?.value },
  ];
  const outParams = [{ desc: 'OUT', varName: out?.name, isRequired: true, value: out?.value }];
  const params = { in: inParams, out: outParams };

  return (
    <FunctionBlock
      blockVarName={null}
      fill={fill}
      inOutNames={['EN', 'ENO']}
      params={params}
      type={type}
    />
  );
}
