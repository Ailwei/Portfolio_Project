import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Stack, Divider } from '@mui/material';
import { FaPlus, FaUserPlus, FaSignOutAlt, FaTrash } from 'react-icons/fa';

const GroupPages = () => {
  const [groupData, setGroupData] = useState({
    group: '',
    description: '',
    group_id: '',
    user_id: '',
    post_id: '',
    newUserId: '',
  });
  const [token, setToken] = useState('');

  useEffect(() => {
    const authtoken = localStorage.getItem('authToken');
    if (authtoken) {
      setToken(authtoken);
    } else {
      console.error('You must login to perform this action');
    }
  }, []);

  const apiCall = async (url, payload) => {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(`Error on ${url}:`, error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Create Group</Typography>
      <Stack spacing={2}>
        <TextField
          label="Group Name"
          value={groupData.group}
          onChange={(e) => setGroupData({ ...groupData, group: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          value={groupData.description}
          onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={() => apiCall('http://127.0.0.1:5000/create_group', {
            group: groupData.group,
            description: groupData.description
          })}
        >
          Create Group
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6">Join / Leave Group</Typography>
      <Stack spacing={2}>
        <TextField
          label="Group ID"
          value={groupData.group_id}
          onChange={(e) => setGroupData({ ...groupData, group_id: e.target.value })}
          fullWidth
        />
        <Button
          variant="outlined"
          color="success"
          startIcon={<FaUserPlus />}
          onClick={() => apiCall('http://127.0.0.1:5000/join_group', { group_id: groupData.group_id })}
        >
          Join Group
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<FaSignOutAlt />}
          onClick={() => apiCall('http://127.0.0.1:5000/leave_group', { group_id: groupData.group_id })}
        >
          Leave Group
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6">Remove User from Group</Typography>
      <Stack spacing={2}>
        <TextField
          label="User ID"
          value={groupData.newUserId}
          onChange={(e) => setGroupData({ ...groupData, newUserId: e.target.value })}
          fullWidth
        />
        <Button
          variant="contained"
          color="warning"
          startIcon={<FaTrash />}
          onClick={() => apiCall('http://127.0.0.1:5000/remove_user_from_group', {
            user_id: groupData.newUserId,
            group_id: groupData.group_id
          })}
        >
          Remove User
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6">Remove Post from Group</Typography>
      <Stack spacing={2}>
        <TextField
          label="Post ID"
          value={groupData.post_id}
          onChange={(e) => setGroupData({ ...groupData, post_id: e.target.value })}
          fullWidth
        />
        <Button
          variant="contained"
          color="error"
          startIcon={<FaTrash />}
          onClick={() => apiCall('http://127.0.0.1:5000/remove_post', {
            post_id: groupData.post_id
          })}
        >
          Remove Post
        </Button>
      </Stack>
    </Box>
  );
};

export default GroupPages;
