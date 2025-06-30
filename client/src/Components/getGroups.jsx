import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid
} from '@mui/material';

const GroupsComponent = ({ currentUser }) => {
  const [groups, setGroups] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authtoken = localStorage.getItem('authToken');
    if (authtoken) {
      setToken(authtoken);
    } else {
      console.error('You must login to perform the action');
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchGroups();
    }
  }, [token]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/groups', {
        headers: {
          Authorization: `Bearer ${token}` // fixed typo from "Authoriation"
        }
      });
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const isMember = (group) => {
    return (
      group &&
      group.members &&
      currentUser &&
      group.members.some((member) => member.user_id === currentUser.user_id)
    );
  };

  const joinGroup = async (groupId) => {
    try {
      await axios.post('https://13.53.199.9/join_group', { group_id: groupId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      await axios.post('https://13.53.199.9/leave_group', { group_id: groupId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>All Groups</Typography>
      <Grid container spacing={2}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.group_id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {group.group_name}
                </Typography>
              </CardContent>
              <CardActions>
                {!isMember(group) && (
                  <Button size="small" variant="contained" onClick={() => joinGroup(group.group_id)}>
                    Join
                  </Button>
                )}
                {isMember(group) && (
                  <>
                    <Button size="small" variant="outlined" color="error" onClick={() => leaveGroup(group.group_id)}>
                      Leave
                    </Button>
                    <Button size="small" variant="contained" color="primary">
                      View Group
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GroupsComponent;
