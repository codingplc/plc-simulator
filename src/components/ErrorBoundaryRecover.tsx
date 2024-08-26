import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { LOAD_EMPTY, LOAD_SAMPLE } from '../store/types';
import { BG_ERROR } from '../consts/colors';

import { ReactComponent as FileText } from '../svg/fileText.svg';
import { ReactComponent as FileEmpty } from '../svg/fileEmpty.svg';

const Container = styled.div`
  background: ${BG_ERROR};
  height: 100%;
  padding-top: 2rem;
`;
const H1 = styled.h1`
  margin-bottom: 4rem;
  text-align: center;
`;
const LoadEmpty = styled(FileEmpty)`
  height: 4rem;
`;
const LoadSample = styled(FileText)`
  height: 4rem;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem auto;
  max-width: 20rem;
`;

const ErrorBoundryRecover: React.FC = () => {
  const dispatch = useDispatch();
  const handeClick = (type: string) => {
    dispatch({ type });
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };
  return (
    <Container>
      <H1>Something went wrong.</H1>
      <Wrapper>
        <h2>Load empty project</h2>
        <LoadEmpty onClick={() => handeClick(LOAD_EMPTY)} />
      </Wrapper>
      <Wrapper>
        <h2>Load sample project</h2>
        <LoadSample onClick={() => handeClick(LOAD_SAMPLE)} />
      </Wrapper>
    </Container>
  );
};

export default ErrorBoundryRecover;
