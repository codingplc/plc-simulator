import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { SET_VAR_VALUE } from "../../store/types";

const Button = styled.button`
  background: none;
  border: none;
  width: 100%;
  :focus {
    outline: none;
  }
`;

interface Props {
  uuid: string;
  value: boolean;
}

const VariableValueBool: React.FC<Props> = (props: Props) => {
  const { uuid, value } = props;
  const dispatch = useDispatch();

  const setVar = (uuid: string, value: boolean) =>
    dispatch({
      type: SET_VAR_VALUE,
      payload: { uuid, value },
    });

  return <Button onClick={() => setVar(uuid, !value)}>{value ? "True" : "False"}</Button>;
};

export default VariableValueBool;
