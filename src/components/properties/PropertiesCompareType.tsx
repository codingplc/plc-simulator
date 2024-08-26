import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Store } from '../../interface';
import { EQU, NEQ, GRT, GEQ, LES, LEQ } from '../../consts/elementTypes';

import PropertiesTypeOption from './PropertiesTypeOption';
import { Typography } from '@mui/material';

const Container = styled.div`
  background-color: white;
  width: 100%;
`;
const TypeList = styled.div`
  display: flex;
  width: 100%;
`;

const PropertiesCompareType: React.FC = () => {
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const element = useSelector((state: Store) => state.elements[selectedUuid]);

  return [EQU, NEQ, GRT, GEQ, LES, LEQ].includes(element?.type) ? (
    <Container>
      <Typography my={1} variant="h6">
        Type
      </Typography>
      <TypeList>
        <PropertiesTypeOption elementType={element.type} option={EQU} />
        <PropertiesTypeOption elementType={element.type} option={NEQ} />
        <PropertiesTypeOption elementType={element.type} option={GRT} />
        <PropertiesTypeOption elementType={element.type} option={GEQ} />
        <PropertiesTypeOption elementType={element.type} option={LES} />
        <PropertiesTypeOption elementType={element.type} option={LEQ} />
      </TypeList>
    </Container>
  ) : null;
};

export default PropertiesCompareType;
