import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import defaultProfileImage from '../assets/profile_default.png';
import { useNavigate, useParams, Link } from 'react-router-dom';

const Fullpost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get_post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPost(response.data);
        const commentsResponse = await axios.get(`http://127.0.0.1:5000/get_comments/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(`http://127.0.0.1:5000/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost({ ...post, liked: !post.liked }); // Toggle locally for instant feedback
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`http://127.0.0.1:5000/add_comment/${postId}`,
        { comment: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      {post && (
        <Card sx={{ p: 2, borderRadius: 3 }}>
          <CardHeader
            avatar={
              <Avatar src={post.profile_picture ? `data:image/png;base64,${post.profile_picture}` : defaultProfileImage} />
            }
            title={
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/viewUserProfile/${post.user_id}`)}
              >
                {post.author_full_name || 'Unknown Author'}
              </Typography>
            }
            subheader={new Date(post.created_at).toLocaleString()}
          />
          <Divider />
          {post.post_thumbnail && (
            <CardMedia
              component="img"
              height="400"
              image={`data:image/png;base64,${post.post_thumbnail}`}
              alt="Post Thumbnail"
              sx={{ mt: 2, objectFit: 'cover' }}
            />
          )}
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>{post.title}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{post.content}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handleLike} color={post.liked ? 'error' : 'default'}>
                {post.liked ? <FaHeart /> : <FaRegHeart />}
              </IconButton>
              <Typography variant="body2">Like</Typography>
              <FaComment style={{ marginLeft: 16 }} />
              <Typography variant="body2">Comment</Typography>
            </Box>

            {/* Comment input */}
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                variant="outlined"
                size="small"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button variant="contained" size="small" onClick={handleComment}>Post</Button>
            </Box>

            {/* Comments */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Comments ({comments.length})</Typography>
            {comments.map(comment => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  <Link to={`/viewUserProfile/${comment.user_id}`} style={{ textDecoration: 'none' }}>
                    {comment.user_full_name}
                  </Link>
                </Typography>
                <Typography variant="caption" sx={{ color: 'gray' }}>
                  {new Date(comment.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body2">{comment.comment}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Fullpost;
