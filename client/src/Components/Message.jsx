import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Divider, Paper } from '@mui/material';
import SendMessage from './SendMessage';
import ReceiveMessage from './ReceiveMessage';
import MessageList from './MessageList';

const MessageComponent = () => {
  const { userId } = useParams();

  return (
    <Box
      sx={{
        maxWidth: '800px',
        margin: 'auto',
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Messages with User ID: {userId}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <ReceiveMessage userId={userId} />
      </Paper>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <SendMessage userId={userId} />
      </Paper>

      <Paper elevation={2} sx={{ p: 2 }}>
        <MessageList userId={userId} />
      </Paper>
    </Box>
  );
};

export default MessageComponent;
