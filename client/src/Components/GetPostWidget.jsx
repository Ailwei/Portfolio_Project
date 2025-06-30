import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const GetPostWidget = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_posts');
      const latestPosts = response.data.posts.slice(0, 10);
      setPosts(latestPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} onClick={handleToggle} sx={{ cursor: 'pointer' }}>
          <Box display="flex" alignItems="center">
            <ArticleIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Latest Posts</Typography>
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              ({posts.length})
            </Typography>
          </Box>
          <IconButton size="small" edge="end" onClick={handleToggle} aria-label={open ? 'Collapse posts' : 'Expand posts'}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List dense>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <ListItem disablePadding key={post.id}>
                  <ListItemButton
                    component={Link}
                    to={`/Fullpost/${post.id}`}
                    sx={{ py: 0.5 }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#1976d2',
                            fontWeight: 500,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {post.title}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ ml: 2 }}>
                No posts available
              </Typography>
            )}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default GetPostWidget;
