import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';

const ReplyMessageBox = ({ messageId }) => {
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log("hello wordl please", messageId)

  const handleReply = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await axios.post(
        `http://127.0.0.1:5000/messages/${messageId}/reply`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReplyContent('');
      setSuccess(true);
      setError(null);
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.error || 'Error sending reply');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <TextField
          label="Reply"
          fullWidth
          multiline
          rows={3}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleReply}
          disabled={!replyContent.trim()}
        >
          Send Reply
        </Button>

        {success && (
          <Typography sx={{ mt: 1 }} color="success.main">
            sent!
          </Typography>
        )}
        {error && (
          <Typography sx={{ mt: 1 }} color="error">
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ReplyMessageBox;
