import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../interface';
import { SET_TYPE } from '../../store/types';
import { OTE, OTL, OTN, OTU } from '../../consts/elementTypes';
import { Typography } from '@mui/material';

const Container = styled.div`
  background-color: white;
  width: 100%;
`;

const Svg = styled.svg`
  cursor: pointer;
  height: 60px;
  margin-right: 1rem;
  width: 60px;
`;

const TypeList = styled.div`
  display: flex;
  width: 100%;
`;

const PropertiesCoilType: React.FC = () => {
  const dispatch = useDispatch();
  const element = useSelector((state: Store) => state.elements[state.temp.selectedUuid]);

  return [OTE, OTL, OTU, OTN].includes(element?.type) ? (
    <Container>
      <Typography my={1} variant="h6">
        Type
      </Typography>
      <TypeList>
        <Svg
          fill={element.type === OTE ? 'green' : 'black'}
          height="5rem"
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: OTE },
            })
          }
          viewBox="0 0 80 80"
          width="5rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Coil</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <circle cx="40" cy="40" r="24" stroke="#FFF" strokeWidth="8" />
        </Svg>
        <Svg
          fill={element.type === OTL ? 'green' : 'black'}
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: OTL },
            })
          }
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Set (latch) coil</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <circle cx="40" cy="40" r="24" stroke="#FFF" strokeWidth="8" />
          <text x="30" y="50" fill="#FFF" stroke="#FFF" style={{ font: '32px sans-serif' }}>
            S
          </text>
        </Svg>
        <Svg
          fill={element.type === OTU ? 'green' : 'black'}
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: OTU },
            })
          }
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Reset (unlatch) coil</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <circle cx="40" cy="40" r="24" stroke="#FFF" strokeWidth="8" />
          <text x="30" y="50" fill="#FFF" stroke="#FFF" style={{ font: '32px sans-serif' }}>
            R
          </text>
        </Svg>
        <Svg
          fill={element.type === OTN ? 'green' : 'black'}
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: OTN },
            })
          }
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Negated coil</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <circle cx="40" cy="40" r="24" stroke="#FFF" strokeWidth="8" />
          <text x="35" y="50" fill="#FFF" stroke="#FFF" style={{ font: '32px sans-serif' }}>
            /
          </text>
        </Svg>
      </TypeList>
    </Container>
  ) : null;
};

export default PropertiesCoilType;
