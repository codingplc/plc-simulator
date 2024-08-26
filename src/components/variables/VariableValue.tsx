import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Store } from '../../interface';
import { BORDER_SIZE, VALUE_COL_WIDTH } from '../../consts/variableTableStyles';
import { VAR_TABLE_BORDER } from '../../consts/colors';

import VariableValueBool from './VariableValueBool';
import VariableValueNumber from './VariableValueNumber';
import VariableValueShowSubVars from './VariableValueShowSubVars';

const Container = styled.td`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  flex: 0 0 ${VALUE_COL_WIDTH};
  padding-left: 0.2rem;
`;

interface Props {
  showSubvars?: () => void;
  showSubVars?: boolean;
  uuid: string;
}

const VariableValue: React.FC<Props> = (props: Props) => {
  const { showSubvars, showSubVars, uuid } = props;
  const variable = useSelector((state: Store) => state.variables[uuid]);
  const { type, value } = variable;
  return (
    <Container>
      {(() => {
        switch (typeof value) {
          case 'boolean':
            return <VariableValueBool uuid={uuid} value={value} />;
          case 'number':
            return <VariableValueNumber type={type} uuid={uuid} value={value} />;
          case 'object':
          case 'undefined':
            return (
              <VariableValueShowSubVars
                onClick={showSubvars}
                showSubVars={showSubVars}
                uuid={uuid}
              />
            );
          default:
            console.warn(`No case for ${typeof value}`);
            return null;
        }
      })()}
    </Container>
  );
};
export default VariableValue;
