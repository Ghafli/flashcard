import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Add as CreateIcon,
  School as StudyIcon,
  ViewModule as BrowseIcon,
  BarChart as StatsIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const actions: QuickAction[] = [
  {
    title: 'Create Deck',
    description: 'Create a new flashcard deck',
    icon: <CreateIcon />,
    path: '/decks/create',
    color: '#4CAF50',
  },
  {
    title: 'Study Now',
    description: 'Continue your learning',
    icon: <StudyIcon />,
    path: '/study',
    color: '#2196F3',
  },
  {
    title: 'Browse Decks',
    description: 'View all your flashcard decks',
    icon: <BrowseIcon />,
    path: '/decks',
    color: '#FF9800',
  },
  {
    title: 'View Stats',
    description: 'Track your progress',
    icon: <StatsIcon />,
    path: '/stats',
    color: '#9C27B0',
  },
];

const QuickActions: React.FC = () => {
  const router = useRouter();

  return (
    <Grid container spacing={2}>
      {actions.map((action) => (
        <Grid item xs={12} sm={6} md={3} key={action.title}>
          <Card
            onClick={() => router.push(action.path)}
            sx={{
              cursor: 'pointer',
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: `${action.color}15`,
                    color: action.color,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickActions;
