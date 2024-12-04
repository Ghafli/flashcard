import { ReactNode, useState, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import Navigation from './Navigation';
import { lightTheme, darkTheme } from '../../styles/theme';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  // Prevent SSR flash by rendering a blank page
  if (!mounted) {
    return (
      <Box sx={{ visibility: 'hidden' }}>
        <Container component="main" maxWidth="lg">
          {children}
        </Container>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        <Container 
          component="main" 
          maxWidth="lg"
          sx={{ 
            flex: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
