import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Box>
      <Button variant="contained" onClick={toggleDrawer(true)}>
        Menu
      </Button>

      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">User Menu</Typography>
          </Box>
          <Divider />
          <List>
            <ListItem button onClick={() => handleNavigate('/profile-update')}>
              <ListItemText primary="Update Profile" />
            </ListItem>
            <ListItem button component={Link} to="/view-groups">
              <ListItemText primary="View Groups" />
            </ListItem>
            <ListItem button component={Link} to="/blocked-users">
              <ListItemText primary="Blocked Users" />
            </ListItem>
            <ListItem button component={Link} to="/unfollow-users">
              <ListItemText primary="Unfollow Users" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem button>
              <ListItemText primary="Delete Account" sx={{ color: 'error.main' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Menu;
