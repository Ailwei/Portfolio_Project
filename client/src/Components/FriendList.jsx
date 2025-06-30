import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfileImage from '../assets/profile_default.png';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const FriendsList = ({ friendType }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return navigate('/login');

      try {
        const response = await axios.get(`http://127.0.0.1:5000/get_friends?type=${friendType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data || []);
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
        else {
          setError(error.message || `Error fetching ${friendType}`);
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [friendType, navigate]);

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <PeopleAltIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          {friendType === 'followers' ? 'Followers' : 'Following'}
        </Typography>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : friends.length === 0 ? (
        <Typography>No {friendType} found</Typography>
      ) : (
        <List>
          {friends.map((friend) => (
            <ListItem key={friend.user_id} secondaryAction={
              <Tooltip title="Message">
                <IconButton component={Link} to={`/messages/${friend.user_id}`} color="primary">
                  <MailOutlineIcon />
                </IconButton>
              </Tooltip>
            }>
              <ListItemAvatar>
                <Avatar
                  src={
                    friend.profile_picture !== 'default'
                      ? `data:image/jpeg;base64,${friend.profile_picture}`
                      : defaultProfileImage
                  }
                  alt={`${friend.first_name} ${friend.last_name}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link to={`/profile/${friend.user_id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                    {friend.first_name} {friend.last_name}
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};

export default FriendsList;
