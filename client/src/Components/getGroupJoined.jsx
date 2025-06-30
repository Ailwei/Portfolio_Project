import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Collapse,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const GetJoinedGroupsWidget = ({ handleGroupClick }) => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/groups_joined', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setJoinedGroups(response.data.groups);
      } catch (error) {
        console.error('Error fetching joined groups:', error);
      }
    };

    if (authToken) fetchJoinedGroups();
  }, [authToken]);

  const leaveGroup = async (groupId) => {
    try {
      await axios.post(
        'https://13.53.199.9/leave_group',
        {
          group_id: groupId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setJoinedGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: '#ffffff',
        userSelect: 'none',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleToggle}
        sx={{ cursor: 'pointer', mb: 2 }}
      >
        <Typography variant="h6" component="div">
          Groups Joined ({joinedGroups.length})
        </Typography>
        <IconButton size="small" onClick={handleToggle} aria-label={open ? 'Collapse groups' : 'Expand groups'}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense>
          {joinedGroups.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              You haven’t joined any groups yet.
            </Typography>
          ) : (
            joinedGroups.map((group, index) => (
              <React.Fragment key={group.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => leaveGroup(group.id)} color="error">
                      <ExitToAppIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Link
                        to={`/get_group/${group.id}`}
                        onClick={() => handleGroupClick(group.id)}
                        style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
                      >
                        {group.name}
                      </Link>
                    }
                  />
                </ListItem>
                {index < joinedGroups.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Collapse>
    </Box>
  );
};

export default GetJoinedGroupsWidget;
