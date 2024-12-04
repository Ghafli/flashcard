import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { database, auth } from '../../lib/firebase';
import StudyStats from './StudyStats';
import RecentDecks from './RecentDecks';
import QuickActions from './QuickActions';
import AchievementsSummary from './AchievementsSummary';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StudyStats stats={userData?.stats} />
            <Box sx={{ mt: 3 }}>
              <RecentDecks decks={userData?.recentDecks} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <QuickActions />
            <Box sx={{ mt: 3 }}>
              <AchievementsSummary achievements={userData?.achievements} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
