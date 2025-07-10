import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Badge,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

import ViewPostPage from './ViewPostPage';
import Menu from './Menu';
import CreatePost from './CreatePostPage';
import CreateGroupForm from './CreateGroup';
import GetGroupWidget from './GetGroupWidget';
import GetPostWidget from './GetPostWidget';
import GetJoinedGroupsWidget from './getGroupJoined';
import FriendsList from './FriendList';
import ReceiveMessage from './ReceiveMessage';
import ViewGroup from './ViewGroup';
import GroupsComponent from './getGroups';
import MessageNotifications from './MsgNotifications';

const Dashboard = ({ setAuthToken, authToken, setCurrentView }) => {
  const [currentView, setDashBoardView] = useState('/');
  const [userId, setUserId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      localStorage.removeItem('authToken');
      setCurrentView('/Login');
    } else {
      axios
        .get('http://127.0.0.1:5000/get_user_id', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserId(res.data.userId))
        .catch((err) => console.error('Error fetching userId:', err));
    }
  }, [setCurrentView]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken('');
    setCurrentView('landing');
  };

  const renderMainView = () => {
    switch (currentView) {
      case 'createPost':
        return <CreatePost />;
      case 'createGroup':
        return <CreateGroupForm />;
      case 'groups':
        return <GroupsComponent />;
      case 'viewGroup':
        return <ViewGroup groupId={selectedGroupId} />;
      case 'messages':
        return (
          <ReceiveMessage
            userId={userId}
            setUnreadCount={setUnreadCount}
          />
        );
      default:
        return <ViewPostPage />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {userId && (
        <MessageNotifications
          userId={userId}
          onUnreadCountChange={setUnreadCount}
        />
      )}

      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography
            onClick={() => setCurrentView('landing')}
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
          >
            CommHub
          </Typography>

          <Button onClick={() => setDashBoardView('createPost')} color="inherit">
            Create Post
          </Button>
          <Button onClick={() => setDashBoardView('createGroup')} color="inherit">
            Create Group
          </Button>
          <Button onClick={() => setDashBoardView('groups')} color="inherit">
            Groups
          </Button>

          <Button
            onClick={() => {
              setDashBoardView('messages');
              setUnreadCount(0);
            }}
            color="inherit"
          >
            <Badge
  color="error"
  badgeContent={unreadCount}
  showZero={true}
  sx={{ color: 'white' }}
>
  <MailIcon />
</Badge>

          </Button>

          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexDirection: 'row', px: 2, py: 2 }}>
        <Box sx={{ width: '250px', mr: 2 }}>
          <FriendsList friendType="followers" />
          <FriendsList friendType="following" />
          <GetJoinedGroupsWidget />
          <GetPostWidget />
        </Box>

        <Box component="main" sx={{ flexGrow: 1, mx: 2 }}>
          {renderMainView()}
        </Box>

        <Box sx={{ width: '250px', ml: 2 }}>
          <GetGroupWidget />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
