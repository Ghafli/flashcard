import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, LinearProgress, Box } from '@mui/material';
import { School, TrendingUp, Stars, EmojiEvents } from '@mui/icons-material';

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  type: 'study_count' | 'streak' | 'mastery' | 'special';
  requirement: number;
  currentValue: number;
}

interface AchievementsSummaryProps {
  achievements?: Achievement[];
}

const AchievementsSummary: React.FC<AchievementsSummaryProps> = ({ achievements = [] }) => {
  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'study_count':
        return <School />;
      case 'streak':
        return <TrendingUp />;
      case 'mastery':
        return <Stars />;
      default:
        return <EmojiEvents />;
    }
  };

  const calculateProgress = (current: number, requirement: number) => {
    return Math.min(Math.round((current / requirement) * 100), 100);
  };

  const getProgressDescription = (achievement: Achievement) => {
    return `${achievement.currentValue}/${achievement.requirement} ${
      achievement.type === 'study_count' ? 'cards' :
      achievement.type === 'streak' ? 'days' :
      achievement.type === 'mastery' ? '%' : 'completed'
    }`;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Achievements
      </Typography>
      {achievements.length === 0 ? (
        <Typography color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
          No achievements yet
        </Typography>
      ) : (
        <List>
          {achievements.map((achievement) => (
            <ListItem key={achievement.id}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ListItemIcon>
                    {getAchievementIcon(achievement.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={achievement.name}
                    secondary={getProgressDescription(achievement)}
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress(achievement.currentValue, achievement.requirement)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: achievement.currentValue >= achievement.requirement ? 'success.main' : 'primary.main'
                    }
                  }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default AchievementsSummary;
