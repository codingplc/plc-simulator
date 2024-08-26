import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../interface';
import { SET_TYPE } from '../../store/types';
import { XIO, XIC, OSP, OSN } from '../../consts/elementTypes';
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

const PropertiesContactType: React.FC = () => {
  const dispatch = useDispatch();
  const element = useSelector((state: Store) => state.elements[state.temp.selectedUuid]);

  return [XIO, XIC, OSP, OSN].includes(element?.type) ? (
    <Container>
      <Typography my={1} variant="h6">
        Type
      </Typography>
      <TypeList>
        <Svg
          fill={element.type === XIC ? 'green' : 'black'}
          height="5rem"
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: XIC },
            })
          }
          viewBox="0 0 80 80"
          width="5rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Normally Open Contact</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="23" y1="16" x2="23" y2="64" stroke="#FFF" strokeWidth="8" />
          <line x1="57" y1="16" x2="57" y2="64" stroke="#FFF" strokeWidth="8" />
        </Svg>
        <Svg
          fill={element.type === XIO ? 'green' : 'black'}
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: XIO },
            })
          }
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Normally Closed Contact</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="23" y1="16" x2="23" y2="64" stroke="#FFF" strokeWidth="8" />
          <line x1="57" y1="16" x2="57" y2="64" stroke="#FFF" strokeWidth="8" />
          <line x1="52" y1="56" x2="28" y2="24" stroke="#FFF" strokeWidth="8" />
        </Svg>
        <Svg
          fill={element.type === OSP ? 'green' : 'black'}
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: OSP },
            })
          }
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>One Shot Positive Contact</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="23" y1="16" x2="23" y2="64" stroke="#FFF" strokeWidth="8" />
          <line x1="57" y1="16" x2="57" y2="64" stroke="#FFF" strokeWidth="8" />
          <text x="29" y="50" fill="#FFF" stroke="#FFF" style={{ font: '32px sans-serif' }}>
            P
          </text>
        </Svg>
        <Svg
          fill={element.type === OSN ? 'green' : 'black'}
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: { type: OSN },
            })
          }
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>One Shot Negative Contact</title>
          <circle cx="40" cy="40" r="40" />
          <line y1="40" x2="20" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="#FFF" strokeWidth="8" />
          <line x1="23" y1="16" x2="23" y2="64" stroke="#FFF" strokeWidth="8" />
          <line x1="57" y1="16" x2="57" y2="64" stroke="#FFF" strokeWidth="8" />
          <text x="28" y="50" fill="#FFF" stroke="#FFF" style={{ font: '32px sans-serif' }}>
            N
          </text>
        </Svg>
      </TypeList>
    </Container>
  ) : null;
};

export default PropertiesContactType;
