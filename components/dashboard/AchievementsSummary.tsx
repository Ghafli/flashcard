import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
}

const AchievementCard: React.FC<Achievement> = ({
  title,
  description,
  progress,
  icon,
  color,
}) => (
  <Card
    sx={{
      mb: 2,
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      '&:last-child': { mb: 0 },
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    }}
  >
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
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
    </CardContent>
  </Card>
);

const AchievementsSummary: React.FC = () => {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first study session',
      progress: 100,
      icon: <SchoolIcon />,
      color: '#4CAF50',
    },
    {
      id: '2',
      title: 'Quick Learner',
      description: 'Master 10 cards in one day',
      progress: 70,
      icon: <StarIcon />,
      color: '#FF9800',
    },
    {
      id: '3',
      title: 'Study Streak',
      description: 'Study for 7 days in a row',
      progress: 40,
      icon: <TimerIcon />,
      color: '#2196F3',
    },
    {
      id: '4',
      title: 'Master Mind',
      description: 'Get 100% accuracy in a session',
      progress: 20,
      icon: <TrophyIcon />,
      color: '#9C27B0',
    },
  ];

  return (
    <Box>
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} {...achievement} />
      ))}
    </Box>
  );
};

export default AchievementsSummary;
