import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const ReceiveMessage = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User ID passed:", userId);

    const getToken = () => localStorage.getItem('authToken');

    const fetchMessages = async () => {
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://127.0.0.1:5000/get_messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },

        });
        console.log("user id fetced", userId)

        setMessages(response.data.messages);
        console.log('Messages:', response.data.messages);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError(error.message || 'Error fetching messages');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate, userId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Received Messages
      </Typography>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={2} sx={{ p: 2 }}>
          <List>
            {messages.length > 0 ? (
              messages.map((message) => (
                <ListItem key={message.id} alignItems="flex-start" divider>
                  <ListItemText
                    primary={message.content}
                    secondary={
                      (message.type === 'inbox'
                        ? `From: ${message.sender_name || 'Unknown'}`
                        : `To: ${message.sender_name || 'Unknown'}`
                      ) + ` • ${new Date(message.created_at).toLocaleString()}`
                    }
                  />

                </ListItem>
              ))
            ) : (
              <Typography variant="body2">No messages found.</Typography>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default ReceiveMessage;
