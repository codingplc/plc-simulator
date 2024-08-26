import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../interface';
import { DISPLAY_TAB } from '../consts/consts';
import Actions from './actions/Actions';
import Diagram from './diagram/Diagram';
import Footer from './Footer';
import TabSelect from './TabSelect';
import Toolbox from './toolbox/Toolbox';
import Menu from './menu/Menu';
import VariableTable from './variables/VariableTable';
import AlertSnackbar from './AlertSnackbar';
import { DELETE_OBJECT } from '../store/types';

const Desktop = styled.div`
  display: grid;
  grid-template: auto 1fr auto / 1fr 2fr;
  grid-template-areas:
    'header header'
    'variables diagram'
    'footer footer';
  height: 100%;
  width: 100%;
`;
const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-area: header;
  width: 100%;
`;
const Mobile = styled.div<{ displayTab: string }>`
  display: grid;
  grid-template: auto auto auto 1fr auto auto / 100%;
  grid-template-areas:
    'menu'
    'toolbox'
    'tab-select'
    '${(props) => props.displayTab}'
    'actions'
    'footer';
  height: 100%;
  width: 100%;
`;
const Container = styled.div`
  font-size: 16px;
  height: 100%;
  width: 100%;
`;

const Simulator: React.FC = () => {
  const [mobileUI, setMobileUI] = useState(window.innerWidth < 640);
  const displayTab = useSelector((state: Store) => state.misc.displayTab);
  const displayDiagramTab = displayTab === DISPLAY_TAB.DIAGRAM;
  const displayVariablesTab = displayTab === DISPLAY_TAB.VARIABLES;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => (window.innerWidth < 640 ? setMobileUI(true) : setMobileUI(false));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Delete') return;
    dispatch({ type: DELETE_OBJECT });
  };

  return (
    <Container>
      {mobileUI ? (
        <Mobile displayTab={displayTab}>
          <Menu />
          <Toolbox />
          <TabSelect />
          {displayVariablesTab && <VariableTable mobileUI={mobileUI} />}
          {displayDiagramTab && <Diagram mobileUI={mobileUI} />}
          <Actions />
          <Footer mobileUI={mobileUI} />
        </Mobile>
      ) : (
        <Desktop tabIndex={0} onKeyDown={(e) => handleOnKeyDown(e)}>
          <Header>
            <Menu />
            <Toolbox />
            <Actions />
          </Header>
          <VariableTable mobileUI={false} />
          <Diagram mobileUI={mobileUI} />
          <Footer mobileUI={mobileUI} />
        </Desktop>
      )}
      <AlertSnackbar />
    </Container>
  );
};

export default Simulator;
