import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Pagination,
  Grid
} from '@mui/material';
import { FaHeart, FaUserMinus, FaRegHeart, FaComment, FaUserPlus } from 'react-icons/fa';
import defaultProfileImage from '../assets/profile_default.png';
import { useNavigate, Link } from 'react-router-dom';

const ViewPosts = ({ setSelectedPost }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState({});
  const [authToken, setToken] = useState(null);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [likesCountPerPost, setLikesCountPerPost] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setToken(token);
    }
    const storedFollowedUsers = JSON.parse(localStorage.getItem('followedUsers')) || [];
    setFollowedUsers(storedFollowedUsers);
    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    fetchFollowedUsers();
  }, [authToken]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_posts?page=${currentPage}`);
      let fetchedPosts = response.data.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(fetchedPosts);
      setTotalPages(response.data.total_pages);
      setCurrentUserId(response.data.current_user_id);

      const postIds = fetchedPosts.map(post => post.id);
      const commentsResponse = await Promise.all(postIds.map(postId => axios.get(`http://127.0.0.1:5000/get_comments/${postId}`)));
      const commentsData = commentsResponse.reduce((acc, response, index) => {
        acc[postIds[index]] = response.data;
        return acc;
      }, {});

      setComments(commentsData);
      fetchReactions(postIds);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchFollowedUsers = async () => {
    if (!authToken) return;
    try {
      const response = await axios.get('http://127.0.0.1:5000/followed_users', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setFollowedUsers(response.data.followed_users);
      localStorage.setItem('followedUsers', JSON.stringify(response.data.followed_users));
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const toggleCommentBox = (postId) => {
    setCommentingPostId(commentingPostId === postId ? null : postId);
  };

  const handleComment = async (postId) => {
    try {
      await axios.post(`http://127.0.0.1:5000/add_comment/${postId}`, { comment: commentContent }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCommentContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      if (followedUsers.includes(userId)) {
        await axios.post(`http://127.0.0.1:5000/unfollow/${userId}`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setFollowedUsers(followedUsers.filter(id => id !== userId));
      } else {
        await axios.post(`http://127.0.0.1:5000/follow/${userId}`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setFollowedUsers([...followedUsers, userId]);
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const handleReaction = async (postId) => {
    const isLiked = !likedPosts[postId]?.clicked;
    try {
      await axios.post(`http://127.0.0.1:5000/reactions`, {
        user_id: currentUserId,
        post_id: postId,
        created_at: new Date().toISOString(),
        activity_type: isLiked ? 1 : 0
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      setLikedPosts(prev => ({ ...prev, [postId]: { clicked: isLiked } }));
      fetchReactions([postId]);
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const fetchReactions = async (postIds) => {
    try {
      const reactionsResponse = await Promise.all(postIds.map(postId => axios.get(`http://127.0.0.1:5000/posts/${postId}/reactions`)));
      const reactionsData = reactionsResponse.reduce((acc, response, index) => {
        acc[postIds[index]] = response.data;
        return acc;
      }, {});

      const updatedLikes = Object.keys(reactionsData).reduce((acc, postId) => {
        const likes = reactionsData[postId].filter(r => r.activity_type === 1).length;
        acc[postId] = likes;
        return acc;
      }, {});
      setLikesCountPerPost(updatedLikes);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handlePostClick = async (postId) => {
    navigate(`/Fullpost/${postId}`);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_post/${postId}`);
      setSelectedPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleViewUserProfile = (userId) => {
    navigate(userId === currentUserId ? '/viewProfile' : `/ViewUserProfile/${userId}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Grid container direction="column" spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2, backgroundColor: '#fff' }}>
              <CardHeader
                avatar={<Avatar src={post.profile_picture ? `data:image/png;base64,${post.profile_picture}` : defaultProfileImage} />}
                title={<Typography variant="subtitle1" fontWeight="bold" onClick={() => handleViewUserProfile(post.user_id)} sx={{ cursor: 'pointer' }}>{post.author_full_name || 'Unknown User'}</Typography>}
                subheader={new Date(post.created_at).toLocaleString()}
              />
              {post.post_thumbnail && (
                <CardMedia
                  component="img"
                  height="350"
                  image={`data:image/png;base64,${post.post_thumbnail}`}
                  alt="Post Thumbnail"
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="body1" sx={{ mb: 1 }}>{post.content}</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => handleReaction(post.id)} color={likedPosts[post.id]?.clicked ? 'error' : 'default'}>
                      {likedPosts[post.id]?.clicked ? <FaHeart /> : <FaRegHeart />}
                    </IconButton>
                    <Typography variant="body2">{likesCountPerPost[post.id] || 0} likes</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => toggleCommentBox(post.id)}><FaComment /></IconButton>
                    <IconButton onClick={() => handleFollow(post.user_id)}>
                      {followedUsers.includes(post.user_id) ? <FaUserMinus /> : <FaUserPlus />}
                    </IconButton>
                  </Box>
                </Box>
                {commentingPostId === post.id && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Write a comment..."
                      variant="outlined"
                      size="small"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button variant="contained" size="small" onClick={() => handleComment(post.id)}>Post</Button>
                  </Box>
                )}
                {comments[post.id]?.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 2, cursor: 'pointer' }} onClick={() => handlePostClick(post.id)}>
                    View all {comments[post.id].length} comments
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </Box>
    </Box>
  );
};

export default ViewPosts;
