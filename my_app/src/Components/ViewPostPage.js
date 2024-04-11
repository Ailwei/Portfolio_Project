import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaUserPlus } from 'react-icons/fa';
import defaultProfileImage from '../images/profile_default.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/ViewPosts.css';

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState({});
  const [authToken, setToken] = useState(null);
  const navigate = useNavigate(); // Use useNavigate to get navigate function

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setToken(token);
    }
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_posts?page=${currentPage}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.total_pages);
      const postIds = response.data.posts.map(post => post.id);
      const commentsResponse = await Promise.all(postIds.map(postIds => axios.get(`http://127.0.0.1:5000/get_comments/${postIds}`)));
      const commentsData = commentsResponse.reduce((acc, response, index) => {
        acc[postIds[index]] = response.data;
        return acc;
      }, {});
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleViewUserProfile = (userId) => {
    navigate(`/viewUserProfile/${userId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/like/${postId}`);
      console.log('Post liked:', response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/add_comment/${postId}`, { comment: commentContent }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Comment added:', response.data);
      setCommentContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/follow/${userId}`);
      console.log('User followed:', response.data);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const toggleCommentBox = (postId) => {
    setCommentingPostId(commentingPostId === postId ? null : postId);
  };

  const handlePostClick = async (postId) => {
    navigate(`/Fullpost/${postId}`);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_post/${postId}`);
      setSelectedPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  return (
    <div className="view-posts-container">
    <div className="posts-list">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h3><a href={`/post/${post.id}`} onClick={() => handlePostClick(post.id)}>{post.title}</a></h3>
            {post.content.length > 100 ? (
              <p>{`${post.content.slice(0, 100)}...`} <a href={`/post/${post.id}`} onClick={() => handlePostClick(post.id)}>Continue Reading</a></p>
            ) : (
              <p>{post.content}</p>
            )}
            <img src={post.profilePictureUrl || defaultProfileImage} alt="Profile" className="profile-image" />
            <span className="author-name">
              {post.author_full_name ? (
                <button onClick={() => handleViewUserProfile(post.user_id)}>
                  {post.author_full_name}
                </button>
              ) : (
                <span>Unknown Author</span>
              )}
            </span>
            <button onClick={() => handleLike(post.id)} className="like-button">
              {post.liked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <FaComment onClick={() => toggleCommentBox(post.id)} className="comment-icon" />
            {commentingPostId === post.id && (
              <div className="comment-box">
                <input type="text" placeholder="Add a comment..." className="comment-input" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                <button onClick={() => handleComment(post.id, commentContent)} className="comment-button">Comment</button>
              </div>
            )}
            <button onClick={() => handleFollow(post.userId)} className="follow-button">
              <FaUserPlus />
            </button>
            <div className="post-comments-summary">
              <span onClick={() => handlePostClick(post.id)} className="expand-comments">
                Comments ({comments[post.id] ? comments[post.id].length : 0})
              </span>
            </div>
            <div className="post-comments-expanded">
              {comments[post.id] && comments[post.id].length > 0 && (
                <div className="comment">
                  <div className="comment-header">
                    <span className="comment-author">
                      <a href={`/user/${comments[post.id][0].user_id}`}>{comments[post.id][0].user_full_name}</a>
                    </span>
                    <span className="comment-date">{new Date(comments[post.id][0].created_at).toLocaleString()}</span>
                  </div>
                  <div className="comment-content">
                    <p>{comments[post.id][0].comment}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, index) => (
        <button key={index + 1} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
      ))}
    </div>
    {selectedPost && (
      <div className="full-post-container">
        <h2>{selectedPost.title}</h2>
        <p>{selectedPost.content}</p>
        {/* Add any other post details you want to display */}
      </div>
    )}
  </div>
);
};

export default ViewPosts;
