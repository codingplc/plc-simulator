import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Store } from '../../interface';
import { UNDO, REDO, LOAD_EMPTY, LOAD_SAMPLE } from '../../store/types';
import { BG_MENU } from '../../consts/colors';
import { auth } from '../../helpers/firebase';
import useOnline from './useOnline';
import { ReactComponent as FileText } from '../../svg/fileText.svg';
import { ReactComponent as FileEmpty } from '../../svg/fileEmpty.svg';
import { ReactComponent as Redo } from '../../svg/redo.svg';
import { ReactComponent as Undo } from '../../svg/undo.svg';
import { ReactComponent as SvgWifiOff } from '../../svg/wifi-off.svg';
import SvgButton from '../SvgButton';
import ShareButton from './ShareButton';
import SignButton from './SignButton';
import SignOut from './SignOut';
import Help from './Help';
import { Alert, Box, Button, IconButton, Snackbar } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function Menu() {
  const canRedo = useSelector((state: Store) => state.temp.canRedo);
  const canUndo = useSelector((state: Store) => state.temp.canUndo);
  const [popupOpen, setPopupOpen] = useState(false);
  const [action, setAction] = useState('');
  const [user] = useAuthState(auth);
  const online = useOnline();
  const dispatch = useDispatch();

  const dispatchAction = (actionType: string) => {
    firebase.analytics().logEvent('load_diagram', { action: actionType });
    dispatch({ type: actionType });
    setPopupOpen(false);
  };
  const openPopup = (action: string) => {
    firebase.analytics().logEvent('open_load_popup');
    setAction(action);
    setPopupOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: BG_MENU,
        display: 'flex',
        flex: '999 1 auto',
        gridArea: 'menu',
      }}
    >
      <SvgButton onClick={() => dispatchAction(UNDO)} disabled={!canUndo} Svg={Undo} />
      <SvgButton onClick={() => dispatchAction(REDO)} disabled={!canRedo} Svg={Redo} />
      <SvgButton onClick={() => openPopup(LOAD_SAMPLE)} Svg={FileText} />
      <SvgButton onClick={() => openPopup(LOAD_EMPTY)} Svg={FileEmpty} />
      {online ? (
        user ? (
          <ShareButton user={user} />
        ) : (
          <SignButton />
        )
      ) : (
        <SvgButton disabled={true} onClick={() => null} Svg={SvgWifiOff} />
      )}
      <SignOut />
      <Help />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      >
        <Alert
          action={
            <>
              <Button onClick={() => dispatchAction(action)} color="inherit" size="small">
                <strong>LOAD</strong>
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setPopupOpen(false)}
              >
                <Close fontSize="small" />
              </IconButton>
            </>
          }
          severity={'warning'}
          color={'warning'}
          variant="filled"
          onClose={() => setPopupOpen(false)}
        >
          {`${action.toLowerCase().replace('load_', 'Load ')} project?`}
        </Alert>
      </Snackbar>
    </Box>
  );
}
