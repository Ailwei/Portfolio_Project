import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/GetPostWidget.css'

const GetPostWidget = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="post-widget-container">
      <h2>Recent Posts</h2>
      <div className="post-titles">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-title">
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default GetPostWidget;
