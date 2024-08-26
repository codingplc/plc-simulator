import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, IconButton, Snackbar } from '@mui/material';
import { Store } from '../interface';
import { CLOSE_ALERT_SNACKBAR } from '../store/types';
import { Close } from '@mui/icons-material';

const AlertSnackbar: React.FC = () => {
  const { color, open, text } = useSelector((state: Store) => state.temp.alertSnackbar);
  const dispatch = useDispatch();

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={() => dispatch({ type: CLOSE_ALERT_SNACKBAR })}
    >
      <Alert
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => dispatch({ type: CLOSE_ALERT_SNACKBAR })}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        severity={color}
        color={color}
        variant="filled"
      >
        {text}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
