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
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const toggleCreatePostPage = () => {
    setShowCreatePostPage(!showCreatePostPage);
    setShowMessages(false);
    setShowCreateGroupForm(false);
    setShowSearchResults(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const toggleCreateGroupForm = () => {
    setShowCreateGroupForm(!showCreateGroupForm);
    setShowMessages(false);
    setShowCreatePostPage(false);
    setShowSearchResults(false);
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}&category=${category}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
      console.log('Search results:', response.data);
    } catch (error) {
      console.error('Error searching:', error);
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
  const handleShowAllCategories = () => {
    setChosenCategory(null); // Reset chosen category
    setShowAllCategories(true); // Show all categories
  }

  const handleSelectCategory = (category) => {
    setChosenCategory(category);
    setShowAllCategories(false)

  }
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
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="search-category"
            >
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
        {!showMessages && !showCreateGroupForm && !showCreatePostPage && !showSearchResults && (
            <ViewPostPage />
          )}
          
          {showMessages && <MessageList userId={userId} />}
          {showCreateGroupForm && <CreateGroupForm />}
          {showCreatePostPage && <CreatePostPage toggleCreatePostPage={toggleCreatePostPage} />}
          {showSearchResults && (
  <div>
    {/* Render message if no matching results found */}
    {searchResults.users.length === 0 &&
      searchResults.posts.length === 0 &&
      searchResults.groups.length === 0 && showAllCategories && (
        <p>No matching results found.</p>
      )}

    {/* Render search results */}
    <div className="search-results">
      {/* Render users */}
      {searchResults?.users && showAllCategories && (
        <div className="search-results-category">
          <h2>Users</h2>
          <ul>
            {searchResults.users.map(user => (
              <li key={user.user_id}>
                <Link to={`/user/${user.user_id}`}>
                  {user.full_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render posts */}
      {searchResults?.posts && showAllCategories && (
        <div className="search-results-category">
          <h2>Posts</h2>
          <ul>
            {searchResults.posts.map(post => (
              <li key={post.post_id}>
                <Link to={`/post/${post.post_id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render groups */}
      {searchResults?.groups && showAllCategories && (
        <div className='search-results-category'>
        <h2>Group</h2>
        <ul>
          {
            searchResults.groups.map(group => (
              <li key={group.group_id}>
                <Link to={`/group/${group.group_id}`}>
                  {group.group_name}
                </Link>
              </li>

            ))}
        </ul>
        </div>
      )}
      {chosenCategory && (
  <div className="search-results-category">
    <h2>{chosenCategory}</h2>
    <ul>
      {searchResults[chosenCategory.toLowerCase()]?.map(item => (
        <li key={item?.id}>
          <Link to={`/ViewProfile/${chosenCategory}/${item?.id}`}>
            {item?.title}
          </Link>
        </li>
            ))}
          </ul>
        </div>
      )}

      {/* Only display the chosen category */}
      {chosenCategory && (
  <div className="search-results-category">
    <h2>{chosenCategory}</h2>
    <ul>
      {searchResults[chosenCategory]?.map(item => (
        <li key={item?.id}>
          {chosenCategory === "users" && (
            <Link to={`/user/${item?.user_id}`}>
              {item?.full_name}
            </Link>
          )}
          {chosenCategory === "groups" && (
            <Link to={`/group/${item?.id}`}>
              {item?.name}
            </Link>
          )}
          {chosenCategory === "posts" && (
            <Link to={`/post/${item?.id}`}>
              {item?.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
)}
      
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
