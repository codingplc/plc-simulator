import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { SET_TYPE } from '../../store/types';

const Svg = styled.svg`
  cursor: pointer;
  height: 60px;
  margin-right: 0.5rem;
  width: 60px;
`;

interface Props {
  elementType: string;
  option: string;
}

const PropertiesTypeOption: React.FC<Props> = (props: Props) => {
  const { elementType, option } = props;
  const dispatch = useDispatch();

  const handleClick = (type: string) => {
    dispatch({
      type: SET_TYPE,
      payload: { type },
    });
  };

  return (
    <Svg
      fill={elementType === option ? 'green' : 'black'}
      height="5rem"
      onClick={() => handleClick(option)}
      viewBox="0 0 80 80"
      width="5rem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{option}</title>
      <circle cx="40" cy="40" r="40" />
      <text
        style={{ font: '24px sans-serif' }}
        x="50%"
        y="60%"
        fill="white"
        textAnchor="middle"
        stroke="white"
        strokeWidth="1px"
      >
        {option}
      </text>
    </Svg>
  );
};

export default PropertiesTypeOption;
