import React, { useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import styled from 'styled-components';

import { SET_VAR_NAME } from '../../store/types';
import { Store } from '../../interface';
import { BG_ERROR, VAR_TABLE_BORDER } from '../../consts/colors';
import { BORDER_SIZE } from '../../consts/variableTableStyles';

const Container = styled.td`
  border-right: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  flex-basis: 100%;
`;
const Input = styled.input<{ nameUsed: boolean; editEnabled: boolean }>`
  background: none;
  border: none;
  box-sizing: border-box;
  height: 100%;
  text-overflow: ellipsis;
  width: 100%;
  :focus {
    background: ${(props) => (props.nameUsed && props.editEnabled ? BG_ERROR : 'white')};
    outline: none;
  }
`;

interface Props {
  selected: boolean;
  uuid: string;
}

const VariableName: React.FC<Props> = (props: Props) => {
  const { selected, uuid } = props;
  const [editEnabled, setEditEnabled] = useState(false);

  const dispatch = useDispatch();
  const variableNames = useSelector((state: Store) => Object.keys(state.variables).map((variableUuid) => state.variables[variableUuid].name), shallowEqual);
  const name = useSelector((state: Store) => state.variables[uuid].name);
  const [inputValue, setInputValue] = useState(name);
  const nameUsed = (variableNames.includes(inputValue) && inputValue !== name) || inputValue == '';
  let newName = inputValue;

  const handleOnBlur = () => {
    if (nameUsed) {
      newName = name;
    }
    setVar(uuid, newName);
    setEditEnabled(false);
  };
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleOnClick = () => {
    selected && setEditEnabled(true);
  };
  const handleOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputValue(name);
    event.currentTarget.select();
    setEditEnabled(true);
  };
  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.currentTarget.blur();
        break;
      case 'Escape':
        newName = name;
        event.currentTarget.blur();
        break;
      case 'Delete':
        event.stopPropagation();
    }
  };
  const setVar = (uuid: string, name: string) => {
    dispatch({
      type: SET_VAR_NAME,
      payload: { uuid, name },
    });
  };

  return (
    <Container onClick={() => handleOnClick()}>
      <Input
        aria-label={`Variable ${uuid.substring(0, 8)} name`}
        editEnabled={editEnabled}
        nameUsed={nameUsed}
        onBlur={() => handleOnBlur()}
        onChange={(event) => handleOnChange(event)}
        onFocus={(event) => handleOnFocus(event)}
        onKeyDown={(event) => handleOnKeyDown(event)}
        type="text"
        value={editEnabled ? inputValue : name}
      />
    </Container>
  );
};

export default VariableName;
