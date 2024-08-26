import { useSelector } from 'react-redux';
import { ElementParameters, MoveType, Store } from '../../interface';
import FunctionBlock from './block-components/FunctionBlock';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: MoveType;
}

export default function BlockMove({ fill, parameters, type }: Props) {
  const inId = parameters?.input[0].uuid;
  const outId = parameters?.output[0].uuid;
  const input = useSelector((state: Store) => state.variables[inId]);
  const output = useSelector((state: Store) => state.variables[outId]);

  const inParams = [{ desc: 'IN', varName: input?.name, isRequired: true, value: input?.value }];
  const outParams = [
    { desc: 'OUT', varName: output?.name, isRequired: true, value: output?.value },
  ];
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
