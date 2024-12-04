import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Custom500() {
  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          500 - Server-side error occurred
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          We are working on fixing the problem. Please try again later.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/"
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
}
