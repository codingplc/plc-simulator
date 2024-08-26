import React from 'react';
import SvgButton from '../actions/ActionButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';

import { auth } from '../../helpers/firebase';
import { OPEN_ALERT_SNACKBAR } from '../../store/types';

import { ReactComponent as LockSvg } from '../../svg/lock.svg';

const Signout: React.FC = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();

  const signout = () =>
    auth
      .signOut()
      .then(() => {
        dispatch({
          type: OPEN_ALERT_SNACKBAR,
          payload: {
            color: 'success',
            open: true,
            text: 'Sign-out successful ',
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: OPEN_ALERT_SNACKBAR,
          payload: {
            color: 'error',
            open: true,
            text: `Sign-out error. ${error.message}`,
          },
        });
        console.error('Sign-out error: ', error);
      });

  return user ? <SvgButton enabled={true} onClick={() => signout()} Svg={LockSvg} /> : null;
};

export default Signout;
