import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';

const SearchResults = ({ results }) => {
  const renderSection = (title, items, type) => (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <List component={Paper} variant="outlined">
        {items.map((item) => (
          <React.Fragment key={item.id || item.user_id}>
            <ListItem
              button
              component={Link}
              to={`/${type}/${item.id || item.user_id}`}
            >
              <ListItemText
                primary={item.full_name || item.name || item.title}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {results?.users?.length > 0 && renderSection('Users', results.users, 'user')}
      {results?.groups?.length > 0 && renderSection('Groups', results.groups, 'group')}
      {results?.posts?.length > 0 && renderSection('Posts', results.posts, 'post')}
      {(!results?.users?.length && !results?.groups?.length && !results?.posts?.length) && (
        <Typography variant="body1" color="text.secondary">
          No results found.
        </Typography>
      )}
    </Box>
  );
};

export default SearchResults;
