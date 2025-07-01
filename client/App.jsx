import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './src/Components/LandingPage';
import LoginPage from './src/Components/LoginPage';
import RegisterPage from './src/Components/RegisterPage';
import ProfileUpdatePage from './src/Components/ProfileUpdate';
import CreatePostPage from './src/Components/CreatePostPage';
import GroupPages from './src/Components/GroupPages';
import ViewProfile from './src/Components/ViewProfile';
import ViewUserProfile from './src/Components/ViewUserProfile';
import Dashboard from './src/Components/Dashboard';
import Fullpost from './src/Components/Fullpost';
import CreateGroupForm from './src/Components/CreateGroup';
import Menu from './src/Components/Menu';
import ViewGroup from './src/Components/ViewGroup';
import GetJoinedGroupsWidget from './src//Components/getGroupJoined';
import FriendsList from './src/Components/FriendList';
import ReceiveMessage from './src/Components/ReceiveMessage';
import SendMessage from './src/Components/SendMessage'
import MessageList from './src/Components/MessageList';


function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  return (
    <div className="app-container">
      <div className="vh-100 gradient-custom">
        <div className="container">
          <Router>
            <div className="main-content">
              <Routes>
              
                <Route path="/" element={<LandingPage authToken={authToken} />} />
                <Route path="/Dashboard" element={<Dashboard authToken={authToken} />}/>
                <Route path="/Login" element={<LoginPage setAuthToken={setAuthToken} />} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/profile-update" element={<ProfileUpdatePage authToken={authToken} />} />
                <Route path="/createPost" element={<CreatePostPage authToken={authToken} />} />
                <Route path="/createGroup" element={<CreateGroupForm authToken={authToken} />} />
                <Route path="/groups" element={<GroupPages authToken={authToken} />} />
                <Route path="/userprofile" element={<ViewProfile authToken={authToken} />} />
                <Route path="/viewUserProfile/:userId" element={<ViewUserProfile authToken={authToken} />} />
                <Route path="/Fullpost/:postId" element={<Fullpost />} />
                <Route path="/menu" element={<Menu authToken={authToken} />} />
                <Route path="/get_group/:groupId" element={<ViewGroup />} />
                <Route path="/joined_groups/:groupId" element={<ViewGroup />} />
                <Route path="/get_friends/:userId" element={<FriendsList />} />
                <Route path="/ReceivedMessage/:userId" element={<ReceiveMessage/>} />
                <Route path="/SendMessage/receiverId" element={<SendMessage/>} />
                <Route path="/messages/userId" element={<MessageList/>} />
              </Routes>
            </div>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
