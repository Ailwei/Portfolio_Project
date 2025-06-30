import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ViewPostPage from './ViewPostPage';
import Menu from './Menu';
import CreatePostPage from './CreatePostPage';
import CreateGroupForm from './CreateGroup';
import GetGroupWidget from './GetGroupWidget';
import GetPostWidget from './GetPostWidget';
import GetFullName from './GetFullname';
import GroupsComponent from './getGroups';
import GetJoinedGroupsWidget from './getGroupJoined';
import ViewGroup from './ViewGroup';
import FriendsList from './FriendList';
import MessageList from './MessageList';
import { AppBar, Box, Button, Typography, Toolbar, TextField } from '@mui/material';
import CreatePost from './CreatePostPage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLogin,setIsLogin] = useState();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showCreatePostPage, setShowCreatePostPage] = useState(false);
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState({ users: [], groups: [], posts: [] });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [userId, setUserId] = useState(null);
  const [showViewGroups, setShowViewGroups] = useState(false);
  const [showFullPosts, setShowFullPosts] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token =  localStorage.getItem('authToken');
      console.log(token)
      try {
        const response = await axios.get('http://127.0.0.1:5000/get_user_id', {
          headers: { Authorization: `Bearer ${token}`}
        });
        setUserId(response.data.userId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleLogout = () => {
   const token =  localStorage.removeItem('authToken');
   console.log(token, "is reoved")
    navigate('/');
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowCreatePostPage(false);
    setShowCreateGroupForm(false);
    setShowSearchResults(false);
    setShowViewGroups(false);
    setShowGroupDetails(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const toggleCreatePostPage = () => {
    setShowCreatePostPage(!showCreatePostPage);
    setShowMessages(false);
    setShowCreateGroupForm(false);
    setShowSearchResults(false);
    setShowViewGroups(false);
    setShowGroupDetails(false);
    setShowFullPosts(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const toggleCreateGroupForm = () => {
    setShowCreateGroupForm(!showCreateGroupForm);
    setShowMessages(false);
    setShowCreatePostPage(false);
    setShowSearchResults(false);
    setShowViewGroups(false);
    setShowGroupDetails(false);
    setShowFullPosts(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const toggleViewGroups = () => {
    setShowViewGroups(!showViewGroups);
    setShowMessages(false);
    setShowCreatePostPage(false);
    setShowSearchResults(false);
    setShowGroupDetails(false);
    setShowFullPosts(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };
  const toogleViewFullPosts = () => {
    setShowViewGroups(!showViewGroups);
    setShowMessages(false);
    setShowCreatePostPage(false);
    setShowSearchResults(false);
    setShowGroupDetails(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const toggleGroupDetails = () => {
    setShowGroupDetails(!showGroupDetails);
    setShowMessages(false);
    setShowCreatePostPage(false);
    setShowSearchResults(false);
    setShowViewGroups(false);
    setShowFullPosts(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const handleSearch = async () => {
    const token =  localStorage.getItem('authToken');
    try {
      const response = await axios.get(`https://13.53.199.9/search?query=${query}&category=${category}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
      setShowSearchResults(true);
      console.log('Search results:', response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSelectCategory = (category) => {
    if (category === 'all') {
      setCategory(null);
    } else {
      setCategory(category);
    }
  };

  const handleGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowGroupDetails(true);
  };

  const handleClick = () => {
    navigate('/Dashboard');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      localStorage.removeItem('authToken')
      navigate('/Login');
    }
  }, [navigate]);

  return (
<Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CommHub
          </Typography>
          {isLogin === 0 ? (
            <>
          <Button component={Link} to="/login" color="inherit">Login</Button>
          <Button component={Link} to="/register" color="inherit">Register</Button>
          <Button component={Link} to="/aboutus" color="inherit">About Us</Button>
          <Menu/>
</>
          ):(
          <>
          <Button onClick={toggleCreatePostPage}  color='inherit'>Create Post</Button>
          <Button onClick={handleLogout} color="inherit">Logout</Button>
          </>
          
          )}
        </Toolbar>
         
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'row', px: 2, py: 2 }}>
  <Box sx={{ width: '250px', mr: 2 }}>
    <FriendsList />
    <GetJoinedGroupsWidget />
    <GetPostWidget/>
  </Box>
  

  <Box component="main" sx={{ flexGrow: 1, mx: 2 }}>
    {showCreatePostPage ? (
      <CreatePost />
    ) : (
      <ViewPostPage />
    )}
  </Box>

  <Box sx={{ width: '250px', ml: 2 }}>
    <GetGroupWidget />
    <MessageList />
  </Box>
</Box>


      </Box>
  );
};

export default Dashboard;
