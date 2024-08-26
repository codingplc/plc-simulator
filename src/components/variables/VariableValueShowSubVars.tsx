import React from "react";
import styled from "styled-components";

import { ReactComponent as Hide } from "../../svg/expandLess.svg";
import { ReactComponent as Show } from "../../svg/expandMore.svg";

const Container = styled.div`
  height: 100%;
`;
const StyledHide = styled(Hide)`
  display: block;
  margin: auto;
`;
const StyledShow = styled(Show)`
  display: block;
  margin: auto;
`;
interface Props {
  showSubVars?: boolean;
  uuid: string;
  onClick?: () => void;
}

const VariableValueShowSubVars: React.FC<Props> = (props: Props) => {
  const { onClick, showSubVars } = props;

  return (
    <Container onClick={onClick}>{showSubVars ? <StyledHide height="100%" /> : <StyledShow height="100%" />}</Container>
  );
};

export default VariableValueShowSubVars;
