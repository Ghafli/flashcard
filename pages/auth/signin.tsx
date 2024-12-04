import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { Home as HomeIcon } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An error occurred during sign in');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Link href="/auth/forgot-password" passHref>
                <MuiLink 
                  underline="hover" 
                  sx={{ 
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.dark'
                    }
                  }}
                >
                  Forgot your password?
                </MuiLink>
              </Link>
            </Box>

            <Stack spacing={2} alignItems="center">
              <Link href="/auth/signup" passHref>
                <MuiLink>
                  Don't have an account? Sign Up
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
        </Paper>
      </Box>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
