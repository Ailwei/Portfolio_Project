import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState('users');
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    try {
      // Fetch user's groups from the backend
      const response = await axios.get('http://127.0.0.1:5000/view_current_user_profile');
      setUserGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const searchUsers = async () => {
    // Implement search users functionality
  };

  const searchGroups = async () => {
    // Implement search groups functionality
  };

  const searchPosts = async () => {
    // Implement search posts functionality
  };

  const handleSearch = async () => {
    // Perform search based on selected option
  };

  const joinGroup = async (groupId) => {
    try {
      // Implement join group functionality
      console.log(`Joining group with ID ${groupId}`);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      // Implement leave group functionality
      console.log(`Leaving group with ID ${groupId}`);
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const isMemberOfGroup = (groupId) => {
    return userGroups.some(group => group.id === groupId);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
      <select onChange={(e) => setSelectedOption(e.target.value)}>
        <option value="users">Users</option>
        <option value="groups">Groups</option>
        <option value="posts">Posts</option>
      </select>
      <button onClick={handleSearch} className="search-button">Search</button>

      <div className="search-results">
        {searchResults.map(result => (
          <div key={result.id} className="search-results-item">
            <div>
              <Link to={result.link}>{result.title}</Link>
              {selectedOption === 'groups' && (
                <div>
                  {!isMemberOfGroup(result.id) ? (
                    <button onClick={() => joinGroup(result.id)}>Join Group</button>
                  ) : (
                    <button onClick={() => leaveGroup(result.id)}>Leave Group</button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
