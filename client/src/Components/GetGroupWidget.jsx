import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Collapse,
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const GetGroupWidget = ({ handleGroupClick }) => {
  const [userGroups, setUserGroups] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/view_current_user_profile', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserGroups(response.data.groups);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    if (authToken) {
      fetchUserGroups();
    }
  }, [authToken]);

  const leaveGroup = async (groupId) => {
    try {
      await axios.post(
        'https://13.53.199.9/leave_group',
        { group_id: groupId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUserGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Card sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 1, userSelect: 'none' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleToggle}
        sx={{ cursor: 'pointer', mb: 1 }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <GroupIcon />
          <Typography variant="h6">My Groups</Typography>
          <Typography variant="body2" color="text.secondary">
            ({userGroups.length})
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleToggle} aria-label={open ? 'Collapse groups' : 'Expand groups'}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {userGroups.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              You don't own any groups yet.
            </Typography>
          ) : (
            userGroups.map((group, index) => (
              <Box key={group.id}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="Leave Group">
                      <IconButton edge="end" onClick={() => leaveGroup(group.id)} color="error">
                        <ExitToApp />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={
                      <Link
                        to={`/get_group/${group.id}`}
                        onClick={() => handleGroupClick(group.id)}
                        style={{ textDecoration: 'none', color: '#1976d2' }}
                      >
                        {group.name}
                      </Link>
                    }
                  />
                </ListItem>
                {index < userGroups.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      </Collapse>
    </Card>
  );
};

export default GetGroupWidget;
