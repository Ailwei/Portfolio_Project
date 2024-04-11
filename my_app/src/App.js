


import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import ProfileUpdatePage from './Components/ProfileUpdate';
import CreatePostPage from './Components/CreatePostPage';
import GroupPages from './Components/GroupPages';
import ViewProfile from './Components/ViewProfile';
import ViewUserProfile from './Components/ViewUserProfile';
import Dashboard from './Components/Dashboard';


function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  return (
    <div className="app-container"> {/* Add a container class to the outer div */}
      <div className="vh-100 gradient-custom">
        <div className="container">
          <Router>
            <div className="main-content">
              <Routes>
             
                <Route path="/" element={<LandingPage authToken={authToken} />} />
                <Route path="/Dashboard" element={<Dashboard authToken={authToken} />}/>
                <Route path="/Login" element={<LoginPage setAuthToken={setAuthToken} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile-update" element={<ProfileUpdatePage authToken={authToken} />} />
                <Route path="/createPost" element={<CreatePostPage authToken={authToken} />} />
                <Route path="/groups" element={<GroupPages authToken={authToken} />} />
                <Route path="/userprofile" element={<ViewProfile authToken={authToken} />} />
                <Route path="/viewUserProfile/:userId" element={<ViewUserProfile authToken={authToken} />} />
                
              </Routes>
            </div>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
