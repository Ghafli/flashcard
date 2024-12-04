import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { School, Timer, TrendingUp } from '@mui/icons-material';

interface StudyStatsProps {
  stats?: {
    cardsStudied: number;
    studyTime: number;
    successRate: number;
  };
}

const StudyStats: React.FC<StudyStatsProps> = ({ stats }) => {
  const formatStudyTime = (minutes: number) => {
    if (!minutes) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Study Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <School sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Cards Studied
              </Typography>
              <Typography variant="h6">{stats?.cardsStudied || 0}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Timer sx={{ mr: 1, color: 'secondary.main' }} />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Study Time
              </Typography>
              <Typography variant="h6">{formatStudyTime(stats?.studyTime || 0)}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Success Rate
              </Typography>
              <Typography variant="h6">{stats?.successRate?.toFixed(1) || '0'}%</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StudyStats;
