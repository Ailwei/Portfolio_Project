import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl
} from '@mui/material';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState({ users: [], groups: [], posts: [] });
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/search?query=${query}&category=${category}`
      );
      setResults(response.data);
      // You might redirect or show results conditionally
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 2,
        mb: 3,
        p: 2
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
      />

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="search-category-label">Category</InputLabel>
        <Select
          labelId="search-category-label"
          id="search-category"
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="users">Users</MenuItem>
          <MenuItem value="groups">Groups</MenuItem>
          <MenuItem value="posts">Posts</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
}

export default SearchBar;
