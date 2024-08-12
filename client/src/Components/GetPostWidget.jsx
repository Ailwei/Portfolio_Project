import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/GetPostWidget.css'

const GetPostWidget = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();

    const intervalId = setInterval(fetchPosts, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://13.53.199.9/get_posts');
      const latestPosts = response.data.posts.slice(0, 10);
      setPosts(latestPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="post-titles">
    <h1> Latest Posts </h1>
  {posts && posts.length > 0 ? (
    posts.map((post) => (
      <div key={post.id} className="post-title">
        <Link to={`/Fullpost/${post.id}`}>{post.title}</Link>
      </div>
    ))
  ) : (
    <p>No posts available</p>
  )}
</div>
   
  );
};

export default GetPostWidget;
