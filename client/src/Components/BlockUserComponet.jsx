import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Stack,
} from '@mui/material';

const BlockUserComponent = () => {
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [action, setAction] = useState('block');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleUserAction = async () => {
    try {
      const url =
        action === 'block'
          ? 'http://127.0.0.1:5000/block-user'
          : 'http://127.0.0.1:5000/unblock-user';

      const response = await axios.post(
        url,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: '#fafafa',
      }}
    >
      <Typography variant="h5" gutterBottom>
        {action === 'block' ? 'Block a User' : 'Unblock a User'}
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="User ID"
          variant="outlined"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="action-label">Action</InputLabel>
          <Select
            labelId="action-label"
            value={action}
            label="Action"
            onChange={handleActionChange}
          >
            <MenuItem value="block">Block</MenuItem>
            <MenuItem value="unblock">Unblock</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color={action === 'block' ? 'error' : 'primary'}
          onClick={handleUserAction}
        >
          {action === 'block' ? 'Block' : 'Unblock'} User
        </Button>
      </Stack>
    </Box>
  );
};

export default BlockUserComponent;
