import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  
  const [results, setResults] = useState({ users: [], groups: [], posts: [] });
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      console.log('Selected category:', category); 
      const response = await axios.get(`https://13.53.199.9/search?query=${query}&category=${category}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
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
  );
}

export default SearchBar;
