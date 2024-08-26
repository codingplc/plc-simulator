import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Store } from '../../interface';
import { TOF, TON, TONR } from '../../consts/elementTypes';

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

const PropertiesTimerType: React.FC = () => {
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const element = useSelector((state: Store) => state.elements[selectedUuid]);

  return [TOF, TON, TONR].includes(element?.type) ? (
    <Container>
      <Typography my={1} variant="h6">
        Type
      </Typography>
      <TypeList>
        <PropertiesTypeOption elementType={element.type} option={TON} />
        <PropertiesTypeOption elementType={element.type} option={TOF} />
        <PropertiesTypeOption elementType={element.type} option={TONR} />
      </TypeList>
    </Container>
  ) : null;
};

export default PropertiesTimerType;
