import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      {results?.users && (
        <div className="search-results-category">
          <h2>Users</h2>
          <ul>
            {results.users.map(user => (
              <li key={user.user_id}>
                <Link to={`/user/${user.user_id}`}>{user.full_name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results?.groups && (
        <div className="search-results-category">
          <h2>Groups</h2>
          <ul>
            {results.groups.map(group => (
              <li key={group.id}>
                <Link to={`/group/${group.id}`}>{group.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results?.posts && (
        <div className="search-results-category">
          <h2>Posts</h2>
          <ul>
            {results.posts.map(post => (
              <li key={post.id}>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
