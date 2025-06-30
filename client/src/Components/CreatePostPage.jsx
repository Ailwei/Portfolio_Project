import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider
} from '@mui/material';
import defaultProfileImage from '../assets/profile_default.png';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [post_thumbnail, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !post_thumbnail) {
      setError('All fields are required');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to create a post');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('post_thumbnail', post_thumbnail);

      await axios.post('http://127.0.0.1:5000/create_post', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setTitle('');
      setContent('');
      setFile(null);
      setSuccess('Post created successfully!');
    } catch (error) {
      setError('Error creating post. Please try again.');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <CardHeader
          avatar={<Avatar src={defaultProfileImage} />}
          title={<Typography variant="subtitle1">Create Post</Typography>}
        />
        <Divider />
        <CardContent component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="What's on your mind?"
            multiline
            minRows={4}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginBottom: 16 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreatePost;
