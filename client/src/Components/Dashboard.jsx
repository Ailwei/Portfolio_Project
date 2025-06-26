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

const Dashboard = () => {
  const navigate = useNavigate();
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
    localStorage.removeItem('authToken');
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
      navigate('/Login');
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <header className="header">
        <nav>
          <Link to="../Dashboard">
            <h1 onClick={handleClick}>CommHub</h1>
          </Link>
          <Link to="#" className="menu-link" onClick={toggleViewGroups}>View Group</Link>
          <Link to="#" className="menu-link" onClick={toggleCreatePostPage}>Create Post</Link>
          <Link to="#" className="menu-link" onClick={toggleCreateGroupForm}>Create Group</Link>
          <Link to="#" className="menu-link" onClick={toggleMessages}>Messages</Link>
          <div className="search-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query"
              className="search-input"
            />
            <select onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a Search Category</option>
              <option value="all">All</option>
              <option value="users">Users</option>
              <option value="groups">Groups</option>
              <option value="posts">Posts</option>
            </select>
            <button onClick={handleSearch} className="search-button">Search</button>
          </div>
          <div className="envelope-container">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="user-info">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
          <Menu />
          <GetFullName userId={userId} />
        </nav>
      </header>
      <main className="main-container">
        <div className="main-content">
          {!showMessages && !showCreateGroupForm && !showCreatePostPage && !showSearchResults && !showViewGroups && !showGroupDetails && <ViewPostPage />}
          {showMessages && (
            <div className="messages-container">
              <h2>Messages</h2>
              <MessageList userId={userId} />
            </div>
          )}
          {showCreateGroupForm && <CreateGroupForm />}
          {showCreatePostPage && <CreatePostPage toggleCreatePostPage={toggleCreatePostPage} />}
          {showViewGroups && <GroupsComponent />}
          {showGroupDetails && <ViewGroup />}
          {showFullPosts && <ViewPostPage  toogleViewFullPosts={toogleViewFullPosts}/>}
          {showSearchResults && (
            <div>
              {(!searchResults || Object.keys(searchResults).length === 0) && (
                <p>No matching results found for {category || 'all categories'}.</p>
              )}
              <div className="search-results">
                {Object.keys(searchResults).map((category) => (
                  <div key={category} className="search-results-category">
                    <h2>{category}</h2>
                    <ul>
                      {searchResults[category]?.map((item) => (
                        <li key={item?.id}>
                          {category === 'users' && (
                            <Link to={`/user/${item?.user_id}`}>
                              {item?.full_name}
                            </Link>
                          )}
                          {category === 'groups' && (
                            <Link to={`/group/${item?.id}`}>
                              {item?.group_name}
                            </Link>
                          )}
                          {category === 'posts' && (
                            <Link to={`/post/${item?.id}`}>
                              {item?.title}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="sidebar">
          <div className="sidebar-item"><GetPostWidget /></div>
          <GetGroupWidget handleGroupClick={handleGroupClick} />
          <GetJoinedGroupsWidget handleGroupClick={handleGroupClick} />
          <FriendsList friendType="followers" />
          <FriendsList friendType="following" />
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 CommHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
