import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PropertiesCoilType from './PropertiesCoilType';
import PropertiesCompareType from './PropertiesCompareType';
import PropertiesContactType from './PropertiesContactType';
import PropertiesCounterType from './PropertiesCounterType';
import PropertiesMathType from './PropertiesMathType';
import PropertiesParameters from './PropertiesParameters';
import PropertiesTimerType from './PropertiesTimerType';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../interface';
import { OPEN_ELEM_PROPERTIES } from '../../store/types';

export default function Properties() {
  const dispatch = useDispatch();
  const openElementProps = useSelector((state: Store) => state.temp.openElementProps);

  const handleClose = () => {
    dispatch({ type: OPEN_ELEM_PROPERTIES, payload: false });
  };

  return (
    <Dialog
      onClose={handleClose}
      open={openElementProps}
      fullWidth
      maxWidth="xs"
      PaperProps={{ style: { overflowY: 'visible' } }}
    >
      <DialogTitle>Block properties</DialogTitle>
      <DialogContent style={{ overflowY: 'visible' }}>
        <PropertiesParameters />
        <PropertiesCoilType />
        <PropertiesCompareType />
        <PropertiesContactType />
        <PropertiesCounterType />
        <PropertiesMathType />
        <PropertiesTimerType />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
