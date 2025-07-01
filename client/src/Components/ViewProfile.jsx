import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { FaUserPlus, FaEnvelope, FaBan } from 'react-icons/fa';
import defaultProfileImage from '../assets/profile_default.png';

const ViewProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setAuthToken(token);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/view_current_user_profile', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [userId, authToken]);

  const handleBlockUser = () => {
    // Block logic
  };

  const handleMessageUser = () => {
    // Message logic
  };

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={
                  profile.profile_picture
                    ? `data:image/png;base64,${profile.profile_picture}`
                    : defaultProfileImage
                }
                alt="Profile"
                sx={{ width: 80, height: 80 }}
              />
              <div>
                <Typography variant="h5">{profile.fullName}</Typography>
                <Typography variant="body2" color="textSecondary">{profile.bio}</Typography>
              </div>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" color="error" startIcon={<FaBan />} onClick={handleBlockUser}>
                Block
              </Button>
              <Button variant="contained" color="primary" startIcon={<FaEnvelope />} onClick={handleMessageUser}>
                Message
              </Button>
              <Button variant="outlined" color="success" startIcon={<FaUserPlus />}>
                Follow
              </Button>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>Groups</Typography>
                <List dense>
                  {profile.groups.map(group => (
                    <ListItem key={group.id}>
                      <ListItemText primary={group.name} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>Memberships</Typography>
                <List dense>
                  {profile.memberships.map(m => (
                    <ListItem key={m.id}>
                      <ListItemText primary={m.groupName} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>Owned Groups</Typography>
                <List dense>
                  {profile.ownedGroups.map(group => (
                    <ListItem key={group.id}>
                      <ListItemText primary={group.name} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewProfile;
