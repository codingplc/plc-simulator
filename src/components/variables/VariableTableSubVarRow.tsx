import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { SUB_VAR_SELECTED, VAR_TABLE_BORDER } from '../../consts/colors';
import { BORDER_SIZE, DELETE_COL_WIDTH, TYPE_COL_WIDTH } from '../../consts/variableTableStyles';
import { Store } from '../../interface';
import { DELETE_VARIABLE } from '../../store/types';

import VariableValue from './VariableValue';

const DeletePlaceholder = styled.td`
  flex: 0 0 ${DELETE_COL_WIDTH};
`;
const Name = styled.td`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  flex-basis: 100%;
  padding-left: 1rem;
`;
const Row = styled.tr<{ bgColor: string }>`
  background: ${(props) => props.bgColor};
  border-bottom: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  display: flex;
  outline: none;
`;
const Type = styled.td`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  padding-left: 0.2rem;
  flex: 0 0 ${TYPE_COL_WIDTH};
`;

interface Props {
  logUuid: (uuid: string) => void;
  name: string;
  parrentUuid: string;
  selected: boolean;
  uuid: string;
}

const VariableTableSubVarRow: React.FC<Props> = (props: Props) => {
  const { logUuid, name, parrentUuid, selected, uuid } = props;
  const variable = useSelector((state: Store) => state.variables[uuid], shallowEqual);
  const { type } = variable;
  const dispatch = useDispatch();

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key !== 'Delete') return;
    dispatch({ type: DELETE_VARIABLE, payload: { uuid: parrentUuid } });
  };

  return (
    <Row
      onKeyDown={(e) => handleOnKeyDown(e)}
      tabIndex={0}
      bgColor={selected ? SUB_VAR_SELECTED : 'none'}
      onClick={() => logUuid(uuid)}
    >
      <Name>{name}</Name>
      <Type>{type}</Type>
      <VariableValue uuid={uuid} />
      <DeletePlaceholder />
    </Row>
  );
};

export default VariableTableSubVarRow;
