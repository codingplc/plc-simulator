import React, { useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { ADD_VARIABLE } from '../../store/types';
import { BOOL, COUNTER, NUMBER, TIME, TIMER } from '../../consts/variables';
import { Store } from '../../interface';
import { BG_ERROR, BG_VARIABLES } from '../../consts/colors';
import { BORDER_SIZE, TYPE_COL_WIDTH } from '../../consts/variableTableStyles';
import NewVarHelp from './NewVarHelp';
import { Box } from '@mui/material';

const Input = styled.input<{ nameUsed: boolean; ref: React.RefObject<HTMLInputElement> }>`
  background: ${(props) => (props.nameUsed ? BG_ERROR : 'white')};
  border: none;
  border-right: ${BORDER_SIZE} solid ${BG_VARIABLES};
  box-sizing: border-box;
  flex-basis: 100%;
  font-size: inherit;
  height: 100%;
  padding-left: 0.25em;
  text-overflow: ellipsis;
  width: 100%;
  z-index: 1;
  :focus {
    outline: none;
  }
`;
const Select = styled.select`
  border: none;
  border-right: ${BORDER_SIZE} solid ${BG_VARIABLES};
  flex: 0 0 ${TYPE_COL_WIDTH};
  font-size: inherit;
  :focus {
    outline: none;
  }
`;
const Submit = styled.input`
  background: white;
  border: none;
  border-top: 2px;
  flex: 0 0 4rem;
  font-size: inherit;
  :focus {
    outline: none;
  }
`;

interface Props {
  displayVarHelp: boolean;
  mobileUI: boolean;
}

export default function VariableTableFoot({ displayVarHelp, mobileUI }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState(BOOL);
  const dispatch = useDispatch();
  const variableNames = useSelector((state: Store) => Object.keys(state.variables).map((variableUuid) => state.variables[variableUuid].name), shallowEqual);
  const nameUsed = variableNames.includes(name);
  const disableSubmit = nameUsed || name == '';
  const inputEl = useRef<HTMLInputElement>(null);

  const handleOnClick = (inputEl: React.RefObject<HTMLInputElement>, name: string, type: string) => {
    if (name === '') return;
    setName('');
    dispatch({
      type: ADD_VARIABLE,
      payload: { name, type },
    });
    inputEl.current && inputEl.current.focus();
  };
  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        !disableSubmit && handleOnClick(inputEl, name, type);
        break;
      case 'Escape':
        setName('');
        break;
    }
  };

  return (
    <Box display="flex" fontSize={mobileUI ? '1.25em' : '1em'} position="relative">
      {displayVarHelp && <NewVarHelp />}
      <Input
        aria-label="New variable name"
        autoComplete="off"
        nameUsed={nameUsed}
        ref={inputEl}
        type="none"
        id="new-var-name-input"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(event) => handleOnKeyDown(event)}
        placeholder="Add new variable"
        value={name}
        data-intro="Add a new PLC variable"
        data-step="1"
        formNoValidate
      />
      <Box position="relative">
        <Select aria-label="New variable type" name="varType" id="new-var-type-select" onChange={(event) => setType(event.target.value)}>
          <option value={BOOL}>{BOOL}</option>
          <option value={NUMBER}>{NUMBER}</option>
          <option value={COUNTER}>{COUNTER}</option>
          <option value={TIME}>{TIME}</option>
          <option value={TIMER}>{TIMER}</option>
        </Select>
      </Box>
      <Submit disabled={disableSubmit} type="submit" value="Submit" onClick={() => handleOnClick(inputEl, name, type)} />
    </Box>
  );
}
