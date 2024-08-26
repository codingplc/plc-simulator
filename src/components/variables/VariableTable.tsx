import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Store } from '../../interface';
import { BG_VARIABLES, VAR_TABLE_BORDER } from '../../consts/colors';

import VariableTableFoot from './VariableTableFoot';
import VariableTableVarRow from './VariableTableVarRow';
import { BORDER_SIZE, DELETE_COL_WIDTH, TYPE_COL_WIDTH, VALUE_COL_WIDTH } from '../../consts/variableTableStyles';

const Body = styled.tbody`
  display: block;
  height: 100%;
  margin-left: 0.1rem;
  overflow-y: auto;
`;
const Container = styled.div`
  background: ${BG_VARIABLES};
  flex: 1;
  min-width: 320px;
`;
const DeletePlaceholder = styled.th`
  flex: 0 0 ${DELETE_COL_WIDTH};
`;
const Header = styled.thead`
  display: block;
  border-bottom: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  height: 1.5em;
`;
const Name = styled.th`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  flex-basis: 100%;
  margin-left: 0.2rem;
`;
const Row = styled.tr`
  display: flex;
`;
const Table = styled.table`
  border-collapse: collapse;
  box-sizing: border-box;
  display: table;
  font-size: 0.81245rem;
  height: 100%;
  outline: none;
  table-layout: fixed;
  text-align: left;
  width: 100%;
`;
const Type = styled.th`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  padding-left: 0.2rem;
  flex: 0 0 ${TYPE_COL_WIDTH};
`;
const Value = styled.th`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  box-sizing: border-box;
  flex: 0 0 ${VALUE_COL_WIDTH};
  padding-left: 0.2rem;
`;
const VariableTab = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: variables;
  height: 100%;
`;

interface Props {
  mobileUI: boolean;
}

const VariableTable: React.FC<Props> = ({ mobileUI }: Props) => {
  const variableIDs = useSelector(
    (state: Store) =>
      Object.keys(state.variables)
        .map((id) => id)
        .filter((id) => !state.variables[id].parrent),
    shallowEqual,
  );
  const [selectedUUID, setSelectedUUID] = useState('');
  const displayVarHelp = variableIDs.length === 0;

  return (
    <VariableTab>
      <Container>
        <Table>
          <Header>
            <Row>
              <Name>Name</Name>
              <Type>Type</Type>
              <Value>Value</Value>
              <DeletePlaceholder />
            </Row>
          </Header>
          <Body>
            {variableIDs.map((uuid: string, index: number) => {
              return (
                <VariableTableVarRow
                  selected={selectedUUID === uuid}
                  selectedUUID={selectedUUID}
                  key={`varRow_${index}`}
                  logUuid={(uuid) => setSelectedUUID(uuid)}
                  uuid={uuid}
                />
              );
            })}
          </Body>
        </Table>
      </Container>
      <VariableTableFoot displayVarHelp={displayVarHelp} mobileUI={mobileUI} />
    </VariableTab>
  );
};

export default VariableTable;
