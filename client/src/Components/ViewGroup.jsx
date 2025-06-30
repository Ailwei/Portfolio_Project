import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';

const ViewGroup = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    const fetchGroupDetails = async () => {
      try {
        const groupRes = await axios.get(`http://127.0.0.1:5000/get_group/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroup(groupRes.data.group);
      } catch (err) {
        setError('Error loading group details');
      }
    };

    const fetchMemberships = async () => {
      try {
        const memberRes = await axios.get(`http://127.0.0.1:5000/joined_groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (memberRes.data.group?.memberships) {
          setMemberships(memberRes.data.group.memberships);
        }
      } catch (err) {
        setError('Error loading group members');
      }
    };

    Promise.all([fetchGroupDetails(), fetchMemberships()]).finally(() => setLoading(false));
  }, [groupId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!group) {
    return (
      <Box mt={4}>
        <Alert severity="warning">No group details found.</Alert>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>{group.group_name}</Typography>
      <Typography variant="body1" gutterBottom>{group.description}</Typography>
      <Typography variant="h6" mt={4}>Members</Typography>
      <List>
        {memberships.map((member) => (
          <React.Fragment key={member.user_id}>
            <ListItem>
              <ListItemText
                primary={member.full_name}
                secondary={`Role: ${member.user_role}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ViewGroup;
