import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';

import { Store } from '../../interface';
import { CYCLE_TIME } from '../../consts/consts';
import { CYCLE_SCAN, SET_SIMULATION } from '../../store/types';

import { ReactComponent as SimulationStart } from '../../svg/simulationStart.svg';
import { ReactComponent as SimulationStop } from '../../svg/simulationStop.svg';
import { Alert, Snackbar } from '@mui/material';

const Square = styled.div`
  margin: 0.25rem;
  position: relative;
  width: 4rem;
  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;
const SvgContainer = styled.div`
  align-items: center;
  background: #f7effa;
  border-radius: 0.5rem;
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
`;

const SimulateButton: React.FC = () => {
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const elements = useSelector((state: Store) => state.elements);
  const dispatch = useDispatch();
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (!simulation) {
      clearInterval(timer);
      dispatch({
        type: CYCLE_SCAN,
      });
    } else {
      const id = setInterval(() => {
        dispatch({
          type: CYCLE_SCAN,
        });
      }, CYCLE_TIME);
      timer = id;
    }
    return () => clearInterval(timer);
  });

  const handleClick = () => {
    firebase.analytics().logEvent('click_simulation');
    if (simulation) {
      dispatch({ type: SET_SIMULATION, payload: { value: false } });
    } else {
      let notConfigured = false;
      for (const key in elements) {
        if (!elements[key].configured) {
          notConfigured = true;
          setOpenSnack(true);
          break;
        }
      }
      if (!notConfigured) {
        dispatch({ type: SET_SIMULATION, payload: { value: true } });
      }
    }
  };

  return (
    <Fragment>
      <Square onClick={() => handleClick()}>
        <SvgContainer>
          {simulation ? (
            <SimulationStop
              fill="#FD3535"
              style={{
                height: 'calc(100% - 1.25rem)',
                margin: 'auto',
              }}
            />
          ) : (
            <SimulationStart
              fill="#04C932"
              style={{
                height: 'calc(100% - 1rem)',
                margin: 'auto',
              }}
            />
          )}
        </SvgContainer>
      </Square>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        autoHideDuration={5000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert severity="warning" color="warning" variant="filled">
          Assign variables to all red highlighted elements.
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default SimulateButton;
