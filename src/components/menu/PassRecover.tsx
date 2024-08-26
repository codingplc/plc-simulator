import React, { useRef, useState } from 'react';
import { auth } from '../../helpers/firebase';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert } from '@mui/material';
interface Props {
  handleFormChange: (form: string) => void;
}

export default function PassRecover(props: Props) {
  const { handleFormChange } = props;
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailRef.current) {
      auth
        .sendPasswordResetEmail(emailRef.current.value)
        .then(() => {
          setError('');
          setSent(true);
        })
        .catch((e) => {
          setSent(false);
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
          Forgot Password?
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid item xs={12}>
            {error && (
              <Alert sx={{ my: 2 }} severity={'error'} color={'error'}>
                {error}
              </Alert>
            )}
            {sent && (
              <Alert sx={{ my: 2 }} severity={'success'} color={'success'}>
                Check your email for further instructions.
              </Alert>
            )}
          </Grid>
          <TextField
            variant="outlined"
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
          <Button sx={{ mt: 3, mb: 2 }} type="submit" fullWidth variant="contained" color="primary">
            Reset password
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link onClick={() => handleFormChange('signIn')} variant="body2">
                Remember your password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={2}></Box>
    </Container>
  );
}
