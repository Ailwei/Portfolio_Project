import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const CreateGroupForm = () => {
  const [groupData, setGroupData] = useState({
    group: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = localStorage.getItem('authToken');
    if (authtoken) {
      setToken(authtoken);
    } else {
      console.error('Auth token not found in localStorage');
    }
  }, []);

  const createGroup = async () => {
    if (!groupData.group.trim() || !groupData.description.trim()) {
      setError('Group name and description cannot be empty');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/create_group',
        {
          group: groupData.group,
          description: groupData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      setError('');
      navigate('/Dashboard'); // redirect or refresh
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <GroupAddIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5">Create New Group</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Group Name"
        value={groupData.group}
        onChange={(e) => setGroupData({ ...groupData, group: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        value={groupData.description}
        onChange={(e) =>
          setGroupData({ ...groupData, description: e.target.value })
        }
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={createGroup}
        sx={{ mt: 2 }}
        fullWidth
      >
        Create Group
      </Button>
    </Paper>
  );
};

export default CreateGroupForm;
