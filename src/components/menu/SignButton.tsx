import { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as SvgShare } from '../../svg/share.svg';
import PassRecover from './PassRecover';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SvgButton from '../SvgButton';
import { Dialog } from '@mui/material';

export const PopupContainer = styled.div`
  padding: 0.5rem;
`;

export default function SignButton() {
  const [open, setOpen] = useState(false);
  const [signForm, setSignForm] = useState('signIn');

  const handleClose = () => {
    setOpen(false);
    setSignForm('signIn');
  };

  return (
    <>
      <SvgButton onClick={() => setOpen(true)} Svg={SvgShare} />
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
      >
        {signForm == 'signIn' && <SignIn handleFormChange={(form) => setSignForm(form)} />}
        {signForm == 'signUp' && <SignUp handleFormChange={(form) => setSignForm(form)} />}
        {signForm == 'passRecover' && (
          <PassRecover handleFormChange={(form) => setSignForm(form)} />
        )}
      </Dialog>
    </>
  );
}
