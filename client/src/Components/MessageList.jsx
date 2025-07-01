import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MessageList = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = () => localStorage.getItem('authToken');

    const fetchMessages = async ({userId}) => {
      setError(null);
      try {
        const token = getToken();
        if (!token) return navigate('/login');

       const response = await axios.get(`http://127.0.0.1:5000/get_messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(response.data.message);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError(err.message || 'Error fetching messages');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate, userId]);

  const handleReply = async (receiverId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return navigate('/login');

      const response = await axios.post(
        `http://127.0.0.1:5000/messages`,
        {
          receiver_id: receiverId,
          content: replyMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReplyMessage('');
      console.log('Reply sent:', response.data);
    } catch (err) {
      console.error('Error replying:', err.message);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Messages
      </Typography>
      {messages.map((message) => (
        <Paper key={message.message_id} elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {message.content}
          </Typography>

          <Stack spacing={2} direction="column">
            <TextField
              label="Type your reply"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => handleReply(message.receiver_id)}
              disabled={!replyMessage.trim()}
            >
              Reply
            </Button>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default MessageList;
