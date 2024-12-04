import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { FolderOpen } from '@mui/icons-material';
import { useRouter } from 'next/router';

interface Deck {
  id: string;
  name: string;
  lastStudied: string;
}

interface RecentDecksProps {
  decks?: Deck[];
}

const RecentDecks: React.FC<RecentDecksProps> = ({ decks = [] }) => {
  const router = useRouter();

  const formatLastStudied = (timestamp: string) => {
    if (!timestamp) return 'Never studied';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleDeckClick = (deckId: string) => {
    router.push(`/decks/${deckId}`);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Decks
      </Typography>
      {decks.length === 0 ? (
        <Typography color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
          No decks studied yet
        </Typography>
      ) : (
        <List>
          {decks.map((deck) => (
            <ListItem 
              key={deck.id} 
              button 
              onClick={() => handleDeckClick(deck.id)}
            >
              <ListItemIcon>
                <FolderOpen />
              </ListItemIcon>
              <ListItemText
                primary={deck.name}
                secondary={`Last studied: ${formatLastStudied(deck.lastStudied)}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RecentDecks;
