import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';

const SendMessage = ({ userId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:5000/send_messages/${userId}`,
        { content: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewMessage('');
    } catch (error) {
      setError(error.message || 'Error sending message');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Send a Message
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SendMessage;
