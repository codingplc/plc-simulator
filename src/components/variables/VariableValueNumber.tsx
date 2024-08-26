import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { SET_VAR_VALUE } from "../../store/types";
import { NUMBER_MIN, NUMBER_MAX, NUMBER, TIME_MIN, TIME_MAX } from "../../consts/variables";

const Input = styled.input`
  background: none;
  border: none;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  :focus {
    background: white;
    outline: none;
  }
`;
interface Props {
  type: string;
  uuid: string;
  value: number;
}

const VariableValueNumber: React.FC<Props> = (props: Props) => {
  const { type, uuid, value } = props;
  const stringValue = value.toString();
  const [inputValue, setInputValue] = useState(stringValue);
  const [editEnabled, setEditEnabled] = useState(false);
  const dispatch = useDispatch();
  const VALUE_MIN = type === NUMBER ? NUMBER_MIN : TIME_MIN;
  const VALUE_MAX = type === NUMBER ? NUMBER_MAX : TIME_MAX;
  let newValue = inputValue;

  const handleOnBlur = () => {
    setVar(uuid, newValue);
    setEditEnabled(false);
  };
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputValue(stringValue);
    event.currentTarget.select();
    setEditEnabled(true);
  };
  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        event.currentTarget.blur();
        break;
      case "Escape":
        newValue = stringValue;
        event.currentTarget.blur();
        break;
    }
  };
  const setVar = (uuid: string, inputValue: string) => {
    const value = inputValue
      ? Math.max(Number(VALUE_MIN), Math.min(Number(VALUE_MAX), Number(parseInt(inputValue))))
      : 0;
    dispatch({
      type: SET_VAR_VALUE,
      payload: { uuid, value },
    });
  };

  return (
    <Input
      aria-label={`Variable ${uuid.substring(0, 8)} value`}
      type="number"
      min={VALUE_MIN}
      max={VALUE_MAX}
      onBlur={() => handleOnBlur()}
      onChange={(event) => handleOnChange(event)}
      onFocus={(event) => handleOnFocus(event)}
      onKeyDown={(event) => handleOnKeyDown(event)}
      value={editEnabled ? inputValue : value}
    />
  );
};

export default VariableValueNumber;
