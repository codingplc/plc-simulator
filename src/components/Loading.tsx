import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 1rem;
`;

const Loading: React.FC = () => {
  return (
    <Container>
      <div className="loader"></div>
      <p className="page-info">Loading Diagram...</p>
    </Container>
  );
};

export default Loading;
