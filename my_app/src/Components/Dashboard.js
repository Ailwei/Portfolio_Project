import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import ViewProfile from './ViewProfile';
import ViewUserProfile from './ViewUserProfile';
import ViewPostPage from './ViewPostPage';
import Menu from './Menu';
import CreatePostPage from './CreatePostPage';
import CreateGroupForm from './CreateGroup';
import GetGroupWidget from './GetGroupWidget';
import GetPostWidget from './GetPostWidget';
import MessageList from './MessageList';
import GetFullName from './GetFullname';
import GroupsComponent from './getGroups';

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
  const [userId, setUserId] = useState();
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [chosenCategory, setChosenCategory] = useState(null);
  const [showViewGroups,setShowViewGroups] = useState(false)

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_user_id');
        setUserId(response.data.userId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get_messages/${userId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (showMessages) {
      fetchMessages();
    }
  }, [showMessages, userId]);

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
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };
const toggleViewGroups = () => {

  setShowViewGroups(!showViewGroups);
    setShowMessages(false);
    setShowCreatePostPage(false);
    setShowSearchResults(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
}


  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}&category=${category}`);
      //if (response.data && response.data.length > 0) 
      setSearchResults(response.data);
      setShowSearchResults(true);
      console.log('Search results:', response.data);
  }
    catch (error) {
      console.error('Error searching:', error);
    }
  };
  const handleSelectCategory = (category) => {
    if (category === 'all') {
      setChosenCategory(null);
    } else {
      setChosenCategory(category);
    }
  };
  
  const handleReply = async (messageId) => {
    try {
      // Find the message by ID
      const message = messages.find(msg => msg.id === messageId);
      // Send reply using the message details
      console.log('Replying to:', message.sender);
      console.log('Reply:', replyMessage);
    } catch (error) {
      console.error('Error replying to message:', error);
    }
  };
  const handleClick = () => {
    navigate('/Dashboard');
  };
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/Login'); // Redirect to the login page if the user is not authenticated
      return;
    }
  }, [navigate]);
  return (
    <div className="dashboard">
      <header className="header">
        
        <nav>
        <Link to='../Dashboard'>
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
      <select onChange={(e) => setChosenCategory(e.target.value)}>
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
          {/* Display user information */}
          <button className="logout-button" onClick={handleLogout}>Logout</button> </div>

          <Menu />
          <GetFullName userId={userId} />
          
        </nav>
       
          
       
      </header>

      <main className="main-container">
  
  <table className="main-content">
    <tbody>
      <tr>
        <td>
         {/* Conditional rendering based on showMessages state */}
         {showMessages && (
                  <div className="messages-container">
                    <h2>Messages</h2>
                    <ul className="message-list">
                      {/* Map through messages array and display each message */}
                      {messages.map(message => (
                        <li key={message.id}>
                          {/* Display message content */}
                          <div>{message.content}</div>
                          {/* Reply input and button */}
                          <div>
                            <textarea
                              value={replyMessage}
                              onChange={e => setReplyMessage(e.target.value)}
                              placeholder="Type your reply here"
                            />
                            <button onClick={() => handleReply(message.id)}>Reply</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
        {!showMessages && !showCreateGroupForm && !showCreatePostPage && !showSearchResults && !showViewGroups && (
            <ViewPostPage />
          )}
          
          {showMessages && <MessageList userId={userId} />}
          {showCreateGroupForm && <CreateGroupForm />}
          {showCreatePostPage && <CreatePostPage toggleCreatePostPage={toggleCreatePostPage} />}
          {showViewGroups && <GroupsComponent />}
          {showSearchResults && (
  <div>
    {/* Render message if no matching results found */}
    {(!searchResults || Object.keys(searchResults).length === 0) && (
      <p>No matching results found for {chosenCategory || 'all categories'}.</p>
    )}

    {/* Render search results */}
    <div className="search-results">
      {/* Display search results for all categories */}
      {Object.keys(searchResults).map(category => (
        <div key={category} className="search-results-category">
          <h2>{category}</h2>
          <ul>
            {searchResults[category]?.map(item => (
              <li key={item?.id}>
                {/* Render link based on category */}
                {category === "users" && (
                  <Link to={`/user/${item?.user_id}`}>
                    {item?.full_name}
                  </Link>
                )}
                {category === "groups" && (
                  <Link to={`/group/${item?.id}`}>
                    {item?.group_name}
                  </Link>
                )}
                {category === "posts" && (
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

</td>
        
        <td className="sidebar">
          <div className="sidebar-item"><GetPostWidget /></div>
          <GetGroupWidget />
        </td>
      </tr>
    </tbody>
  </table>
</main>

      <footer className="footer">
        <p>&copy; 2024 CommHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
export default Dashboard;
