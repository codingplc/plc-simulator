import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Store } from '../../interface';
import { ADD, SUB, MUL, DIV } from '../../consts/elementTypes';

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

const PropertiesMathType: React.FC = () => {
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const element = useSelector((state: Store) => state.elements[selectedUuid]);

  return [ADD, SUB, MUL, DIV].includes(element?.type) ? (
    <Container>
      <Typography my={1} variant="h6">
        Type
      </Typography>
      <TypeList>
        <PropertiesTypeOption elementType={element.type} option={ADD} />
        <PropertiesTypeOption elementType={element.type} option={SUB} />
        <PropertiesTypeOption elementType={element.type} option={MUL} />
        <PropertiesTypeOption elementType={element.type} option={DIV} />
      </TypeList>
    </Container>
  ) : null;
};

export default PropertiesMathType;
