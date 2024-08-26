import { useSelector } from 'react-redux';
import { CounterType, ElementParameters, Store } from '../../interface';
import FunctionBlock from './block-components/FunctionBlock';
import { CTD, CTUD } from '../../consts/elementTypes';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: CounterType;
}

export default function BlockCounter({ fill, parameters, type }: Props) {
  const inOutID = parameters?.inOut[0].uuid;
  const variable = useSelector((state: Store) => state.variables[inOutID]);
  const { name } = variable ?? { name: undefined };
  const { PV, CV, R, LD, CD, QD } = variable?.subVars ?? {};
  const pvValue = useSelector((state: Store) => state.variables[PV]?.value);
  const cvValue = useSelector((state: Store) => state.variables[CV]?.value);
  const rValue = useSelector((state: Store) => state.variables[R]?.value);
  const ldValue = useSelector((state: Store) => state.variables[LD]?.value);
  const cdValue = useSelector((state: Store) => state.variables[CD]?.value);
  const qdValue = useSelector((state: Store) => state.variables[QD]?.value);

  const inParams = [
    ...(type === CTUD ? [{ desc: 'CD', value: cdValue }] : []),
    type === CTD ? { desc: 'LD', value: ldValue } : { desc: 'R', value: rValue },
    ...(type === CTUD ? [{ desc: 'LD', value: ldValue }] : []),
    { desc: 'PV', value: pvValue },
  ];
  const outParams = [
    ...(type === CTUD ? [{ desc: 'QD', value: qdValue }, null, null] : [null]),
    { desc: 'CV', value: cvValue },
  ];
  const params = { in: inParams, out: outParams };

  return (
    <FunctionBlock
      blockVarName={name}
      fill={fill}
      inOutNames={type === CTD ? ['CD', 'Q'] : ['CU', type === CTUD ? 'QU' : 'Q']}
      params={params}
      type={type}
    />
  );
}
