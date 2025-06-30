import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const GroupPost = ({ groupId, userId }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');



  const handlePostSubmit = () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await 
    }

    console.log(token)
    console.log(`Posting to group ${groupId}: ${content}`);
   
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" mb={2}>Create a Post in Group</Typography>
      <TextField
        multiline
        minRows={4}
        fullWidth
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handlePostSubmit} disabled={!content.trim()}>
        Post
      </Button>
    </Box>
  );
};

export default GroupPost;
