import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
  Stack,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { Home as HomeIcon } from '@mui/icons-material';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
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

            <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
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
        </Box>
      </Paper>
    </Container>
  );
}
