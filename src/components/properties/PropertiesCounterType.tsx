import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Store } from '../../interface';
import { CTD, CTU, CTUD } from '../../consts/elementTypes';

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

const PropertiesCounterType: React.FC = () => {
  const element = useSelector((state: Store) => state.elements[state.temp.selectedUuid]);

  return [CTD, CTU, CTUD].includes(element?.type) ? (
    <Container>
      <Typography my={1} variant="h6">
        Type
      </Typography>
      <TypeList>
        <PropertiesTypeOption elementType={element.type} option={CTU} />
        <PropertiesTypeOption elementType={element.type} option={CTD} />
        <PropertiesTypeOption elementType={element.type} option={CTUD} />
      </TypeList>
    </Container>
  ) : null;
};

export default PropertiesCounterType;
