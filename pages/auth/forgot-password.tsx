import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { Home as HomeIcon } from '@mui/icons-material';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // TODO: Implement password reset functionality
      // For now, just show a success message
      setStatus('success');
      setMessage('If an account exists with this email, you will receive password reset instructions.');
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Reset Password
          </Typography>

          {message && (
            <Alert 
              severity={status === 'success' ? 'success' : 'error'} 
              sx={{ width: '100%', mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Reset Password'}
            </Button>

            <Stack spacing={2} direction="column" alignItems="center">
              <Link href="/auth/signin" passHref>
                <MuiLink>
                  Back to Sign In
                </MuiLink>
              </Link>
              <Link href="/" passHref>
                <Button
                  startIcon={<HomeIcon />}
                  variant="outlined"
                  fullWidth
                >
                  Back to Home
                </Button>
              </Link>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
