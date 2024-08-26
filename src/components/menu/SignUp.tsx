import React, { useRef, useState } from 'react';
import { auth } from '../../helpers/firebase';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface Props {
  handleFormChange: (form: string) => void;
}

export default function SignUp(props: Props) {
  const { handleFormChange } = props;
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailRef.current && passwordRef.current) {
      auth
        .createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
        .then()
        .catch((e) => {
          setError(e.message);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <Box component="form" noValidate onSubmit={(e) => handleSubmit(e)} sx={{ mt: 3 }}>
          {error && (
            <Grid item xs={12}>
              <Alert sx={{ my: 2 }} severity={'error'}>
                {error}
              </Alert>
            </Grid>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={emailRef}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            inputRef={passwordRef}
          />
          <Grid item xs={12}>
            <Box display="flex" mt={2}>
              <Checkbox
                value="agreeToTermsAndConditions"
                checked={checked}
                onChange={() => setChecked(!checked)}
                color="primary"
                inputProps={{ 'aria-label': 'terms checkbox' }}
              />
              <Typography>
                I have read and agree to the{' '}
                <Link
                  href="https://codingplc.com/terms-of-service/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms of service
                </Link>{' '}
                agreement and{' '}
                <Link href="https://codingplc.com/privacy-policy/" target="_blank" rel="noreferrer">
                  Privacy policy
                </Link>
                .
              </Typography>
            </Box>
          </Grid>
          <Button
            disabled={!checked}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link onClick={() => handleFormChange('signIn')} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={3}></Box>
    </Container>
  );
}
