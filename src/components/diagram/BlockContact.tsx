import { useDispatch, useSelector } from 'react-redux';

import { ELEMENT, OUT_ON } from '../../consts/colors';
import { ContactType, ElementParameters, Store } from '../../interface';
import { OSN, OSP, XIC, XIO } from '../../consts/elementTypes';
import { SET_VAR_VALUE } from '../../store/types';
import { Box } from '@mui/material';
import {
  CONTACT_HEIGHT,
  CONTACT_SYMBOL_WIDTH,
  MID_CELL_HEIGHT,
  TYPE_HEIGHT,
} from '../../consts/blockDimensions';
import BlockVariableName from './block-components/BlockVarName';
import MiddleLineBox from './block-components/MiddleLineBox';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: ContactType;
}

export default function BlockContact({ fill, parameters, type }: Props) {
  const inputID = parameters?.input[0].uuid;
  const variable = useSelector((state: Store) => state.variables[inputID]);
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const dispatch = useDispatch();
  const contactFill = (() => {
    if (simulation) {
      switch (type) {
        case XIO:
          return !variable?.value ? OUT_ON : ELEMENT;
        case XIC:
          return variable?.value ? OUT_ON : ELEMENT;
        default:
          return fill;
      }
    } else return fill;
  })();

  const handleOnClick = () => {
    simulation &&
      dispatch({
        type: SET_VAR_VALUE,
        payload: { uuid: inputID, value: !variable?.value },
      });
  };

  return (
    <Box
      sx={{
        display: 'inline-grid',
        gridTemplateColumns: 'min-content minmax(min-content, 1.5em) min-content',
        gridTemplateRows: `1em 1.5em ${MID_CELL_HEIGHT}`,
      }}
      onClick={() => handleOnClick()}
    >
      <Box
        sx={{
          gridColumn: 1,
          gridRow: 1,
          height: TYPE_HEIGHT,
        }}
      />
      <BlockVariableName columnStart={1} columnEnd={4} row={2} name={variable?.name} />
      <MiddleLineBox color={contactFill} columnStart={1} columnEnd={2} row={3} />
      <Box
        sx={{
          gridColumn: 2,
          gridRow: 3,
          height: CONTACT_HEIGHT,
          width: '1.5em',
          borderRight: `solid ${CONTACT_SYMBOL_WIDTH} ${contactFill}`,
          borderLeft: `solid ${CONTACT_SYMBOL_WIDTH} ${contactFill}`,
          marginTop: `calc((${MID_CELL_HEIGHT} - ${CONTACT_HEIGHT})/2)`,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          color: contactFill,
          fontSize: type === XIO ? '1.5em' : '1.25em',
          fontWeight: 'bold',
          gridColumn: 2,
          gridRow: 3,
          justifyContent: 'center',
          lineHeight: type === XIO ? '0.86em' : '1em',
        }}
      >
        {type === XIO && '\\'}
        {type === OSN && 'N'}
        {type === OSP && 'P'}
      </Box>
      <MiddleLineBox color={contactFill} columnStart={3} columnEnd={4} row={3} />
    </Box>
  );
}
