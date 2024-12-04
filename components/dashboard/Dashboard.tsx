import React from 'react';
import { Box, Button, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import StudyStats from './StudyStats';
import QuickActions from './QuickActions';
import RecentDecks from './RecentDecks';
import AchievementsSummary from './AchievementsSummary';

interface DashboardStats {
  studyStreak: number;
  cardsMastered: number;
  perfectSessions: number;
  dailyGoalProgress: number;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const stats: DashboardStats = {
    studyStreak: 0,
    cardsMastered: 0,
    perfectSessions: 0,
    dailyGoalProgress: 0
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2
            }}
          >
            <Typography 
              variant={isSmallScreen ? 'h5' : 'h4'} 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
            </Typography>
            <Button
              variant="contained"
              fullWidth={isSmallScreen}
              startIcon={<AddIcon />}
              onClick={() => router.push('/decks/create')}
              sx={{
                borderRadius: 2,
                minWidth: { sm: '200px' }
              }}
            >
              Create Flashcard
            </Button>
          </Box>
        </Grid>

        {/* Study Stats Section */}
        <Grid item xs={12}>
          <Box sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <StudyStats {...stats} />
          </Box>
        </Grid>

        {/* Quick Actions Section */}
        <Grid item xs={12}>
          <Box sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <QuickActions />
          </Box>
        </Grid>

        {/* Main Content Grid */}
        <Grid item xs={12} md={8}>
          <Box sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            height: '100%',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontWeight: 600
              }}
            >
              Recent Decks
            </Typography>
            <RecentDecks />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            height: '100%',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontWeight: 600
              }}
            >
              Achievements
            </Typography>
            <AchievementsSummary />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
