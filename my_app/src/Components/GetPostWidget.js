import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/GetPostWidget.css'

const GetPostWidget = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();

    // Set up interval to periodically fetch latest posts
    const intervalId = setInterval(fetchPosts, 60000); // Fetch every minute

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_posts');
      const latestPosts = response.data.posts.slice(0, 10);
      setPosts(latestPosts);
      //setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="post-titles">
  {posts && posts.length > 0 ? (
    posts.map((post) => (
      <div key={post.id} className="post-title">
        <Link to={`/Fullpost/${post.id}`}>{post.title}</Link> {/* This line was added */}
      </div>
    ))
  ) : (
    <p>No posts available</p>
  )}
</div>
   
  );
};

export default GetPostWidget;
