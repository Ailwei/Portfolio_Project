import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
  Mail,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import defaultProfileImage from '../assets/profile_default.png';

const ViewUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [followedUsers, setFollowedUsers] = useState([]);
  const { userId, groupId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    if (!authToken) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/view_user_profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setProfile(response.data);
        setFollowedUsers(response.data.following || []);
        // console.log('Fetched profile data:', response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchProfile();
  }, [userId, authToken]);

  useEffect(() => {
    if (!authToken) return;
    const fetchFollowedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/followed_users', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setFollowedUsers(response.data.followed_users || []);
      } catch (error) {
        console.error('Error fetching followed users:', error);
      }
    };
    fetchFollowedUsers();
  }, [authToken]);

  const handleBlockUserorUnblockUser = async () => {
    try {
      const response = profile.blocked
        ? await axios.post(
            `http://localhost:5000/unblock_user`,
            { user_id: userId, group_id: groupId },
            { headers: { Authorization: `Bearer ${authToken}` } }
          )
        : await axios.post(
            `http://localhost:5000/block_user`,
            { user_id: userId, group_id: groupId },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
      // Refresh profile or update state after block/unblock
      setProfile((prev) => ({ ...prev, blocked: !prev.blocked }));
      // console.log(profile.blocked ? 'User unblocked:' : 'User blocked:', response.data);
    } catch (error) {
      console.error('Error blocking/unblocking user', error);
    }
  };

  const handleMessageUser = () => {
    setShowMessageInput((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/send_message/${userId}`,
        { user_id: userId, content: messageContent },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessageContent('');
      setShowMessageInput(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFollow = async () => {
    if (!profile?.userId) {
      console.error('Invalid user ID to follow/unfollow');
      return;
    }
    const id = profile.userId;
    try {
      if (followedUsers.includes(id)) {
        await axios.post(
          `http://localhost:5000/unfollow/${id}`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setFollowedUsers((prev) => prev.filter((uid) => uid !== id));
      } else {
        await axios.post(
          `http://localhost:5000/follow/${id}`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setFollowedUsers((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      {/* Profile Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={
                profile.profile_picture
                  ? `data:image/png;base64,${profile.profile_picture}`
                  : defaultProfileImage
              }
              alt="Profile"
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5">{profile.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.bio || 'No bio available'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color={profile.blocked ? 'success' : 'error'}
          onClick={handleBlockUserorUnblockUser}
          startIcon={profile.blocked ? <CheckCircle /> : <Block />}
          sx={{ mr: 1 }}
        >
          {profile.blocked ? 'Unblock' : 'Block'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleMessageUser}
          startIcon={<Mail />}
          sx={{ mr: 1 }}
        >
          Message
        </Button>

        <Button
          variant="contained"
          color={followedUsers.includes(profile.id) ? 'warning' : 'primary'}
          onClick={handleFollow}
          startIcon={
            followedUsers.includes(profile.id) ? <PersonRemove /> : <PersonAdd />
          }
        >
          {followedUsers.includes(profile.id) ? 'Unfollow' : 'Follow'}
        </Button>
      </Box>

      {/* Message Input */}
      {showMessageInput && (
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Type your message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button variant="contained" onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      )}

      {/* Groups */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Groups
        </Typography>
        {profile.groups && profile.groups.length > 0 ? (
          profile.groups.map((group) => (
            <Typography key={group.id}>• {group.name}</Typography>
          ))
        ) : (
          <Typography>No groups available</Typography>
        )}
      </Paper>

      {/* Memberships */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Memberships
        </Typography>
        {profile.memberships && profile.memberships.length > 0 ? (
          profile.memberships.map((membership) => (
            <Typography key={membership.id}>• {membership.groupName}</Typography>
          ))
        ) : (
          <Typography>No memberships available</Typography>
        )}
      </Paper>

      {/* Owned Groups */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Owned Groups
        </Typography>
        {profile.ownedGroups && profile.ownedGroups.length > 0 ? (
          profile.ownedGroups.map((group) => (
            <Typography key={group.id}>• {group.name}</Typography>
          ))
        ) : (
          <Typography>No owned groups</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ViewUserProfile;
