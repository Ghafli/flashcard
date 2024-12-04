import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import {
  LocalFire as StreakIcon,
  Star as MasteryIcon,
  EmojiEvents as PerfectIcon,
  TrendingUp as GoalIcon,
} from '@mui/icons-material';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
  progress?: number;
  unit?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
  progress,
  unit,
}) => (
  <Card sx={{ 
    height: '100%',
    borderRadius: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: '50%',
            bgcolor: `${color}15`,
            color: color,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {value}{unit && ` ${unit}`}
          </Typography>
        </Box>
      </Box>
      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: `${color}15`,
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
              borderRadius: 3,
            },
          }}
        />
      )}
    </CardContent>
  </Card>
);

interface StudyStatsProps {
  studyStreak?: number;
  cardsMastered?: number;
  perfectSessions?: number;
  dailyGoalProgress?: number;
}

const StudyStats: React.FC<StudyStatsProps> = ({
  studyStreak = 0,
  cardsMastered = 0,
  perfectSessions = 0,
  dailyGoalProgress = 0,
}) => {
  const stats = [
    {
      icon: <StreakIcon />,
      title: 'Study Streak',
      value: studyStreak,
      color: '#FF9800',
      unit: 'days',
    },
    {
      icon: <MasteryIcon />,
      title: 'Cards Mastered',
      value: cardsMastered,
      color: '#4CAF50',
      unit: 'cards',
    },
    {
      icon: <PerfectIcon />,
      title: 'Perfect Sessions',
      value: perfectSessions,
      color: '#2196F3',
      unit: 'sessions',
    },
    {
      icon: <GoalIcon />,
      title: 'Daily Goal',
      value: `${dailyGoalProgress}%`,
      color: '#9C27B0',
      progress: dailyGoalProgress,
    },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StudyStats;
