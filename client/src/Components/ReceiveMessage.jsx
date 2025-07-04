import React, { useState, useEffect } from 'react';
import ReplyMessageBox from './ReplyMessage';
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
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(
          `http://127.0.0.1:5000/get_messages/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setThreads(response.data.conversations || []);
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

  const handleSelectThread = (id) => {
    setActiveUserId(id);
  };

  const activeThread = threads.find((t) => t.user_id === activeUserId);

  const otherThreads = threads.filter((t) => t.user_id !== activeUserId);

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography variant="h6" gutterBottom>
        Inbox ({threads.length})
      </Typography>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : threads.length === 0 ? (
        <Typography>No conversations found.</Typography>
      ) : (
        <>
          {activeThread && (
            <Paper
              elevation={3}
              sx={{
                mb: 4,
                p: 2,
                maxHeight: 400,
                overflowY: 'auto',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Chat with {activeThread.user_name}
              </Typography>
              <List>
                {activeThread.messages.map((msg) => (
                  <ListItem
                    key={msg.message_id}
                    sx={{
                      justifyContent: msg.type === 'inbox' ? 'flex-start' : 'flex-end',
                      display: 'flex',
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '75%',
                        bgcolor: msg.type === 'inbox' ? '#bbdefb' : '#fff9c4',
                        p: 1.5,
                        borderRadius: 2,
                        boxShadow: 1,
                        wordBreak: 'break-word',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {msg.type === 'inbox' ? `From` : `To`} {activeThread.user_name}
                      </Typography>
                      <Typography variant="body1">{msg.content}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', textAlign: 'right', opacity: 0.6, mt: 0.5 }}
                      >
                        {new Date(msg.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>

              <ReplyMessageBox
                messageId={activeThread.messages[activeThread.messages.length - 1]?.message_id}
              />
            </Paper>
          )}

          <List>
            {otherThreads.map((thread) => {
              const lastMsg =
                thread.messages.length > 0
                  ? thread.messages[thread.messages.length - 1]
                  : null;
              return (
                <ListItem
                  button
                  key={thread.user_id}
                  onClick={() => handleSelectThread(thread.user_id)}
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <ListItemText
                    primary={thread.user_name}
                    secondary={lastMsg?.content || 'No messages yet'}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </Box>
  );
};

export default ReceiveMessage;
