import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
} from '@mui/material';

interface Deck {
  id: string;
  title: string;
  totalCards: number;
  masteredCards: number;
  lastStudied: string;
}

const mockDecks: Deck[] = [
  {
    id: '1',
    title: 'JavaScript Basics',
    totalCards: 50,
    masteredCards: 30,
    lastStudied: '2024-01-20',
  },
  {
    id: '2',
    title: 'React Hooks',
    totalCards: 40,
    masteredCards: 15,
    lastStudied: '2024-01-19',
  },
  {
    id: '3',
    title: 'TypeScript Types',
    totalCards: 35,
    masteredCards: 20,
    lastStudied: '2024-01-18',
  },
];

const DeckCard: React.FC<{ deck: Deck }> = ({ deck }) => {
  const progress = (deck.masteredCards / deck.totalCards) * 100;

  return (
    <Card sx={{ 
      mb: 2, 
      borderRadius: 2,
      '&:last-child': { mb: 0 },
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
      }
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {deck.title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress: {deck.masteredCards}/{deck.totalCards} cards
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(33, 150, 243, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#2196F3',
                borderRadius: 3,
              }
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Last studied: {new Date(deck.lastStudied).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

const RecentDecks: React.FC = () => {
  return (
    <Box>
      {mockDecks.length > 0 ? (
        mockDecks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))
      ) : (
        <Typography color="text.secondary" align="center">
          No recent decks found. Create your first deck to get started!
        </Typography>
      )}
    </Box>
  );
};

export default RecentDecks;
