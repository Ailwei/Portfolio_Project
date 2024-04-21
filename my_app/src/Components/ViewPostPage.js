import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaUserPlus } from 'react-icons/fa';
import defaultProfileImage from '../images/profile_default.png';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import ViewProfile from './ViewProfile'
import '../styles/ViewPosts.css';

const ViewPosts = ({setSelectedPost}) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState({});
  const [authToken, setToken] = useState(null);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null)


  const navigate = useNavigate();

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
      setCurrentUserId(response.data.current_user_id);
      const postIds = response.data.posts.map(post => post.id);
      const commentsResponse = await Promise.all(postIds.map(postId => axios.get(`http://127.0.0.1:5000/get_comments/${postId}`)));
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
    if (userId) {
      if (userId === currentUserId) {
        navigate(`/viewProfile`);
      } else {
        navigate(`/ViewUserProfile/${userId}`);
      }
    } else {
      console.error('User ID is undefined');
    }
  };

  const handleCommenterClick = (userId) => {
    navigate(`/viewUserProfile/${userId}`)
  }

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

  const handleComment = async (postId) => {
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
              <Link to={`/Fullpost/${post.id}`} onClick={() => handlePostClick(post.id)} className="post-title">
                {post.title}
              </Link>
              {post.content.length > 100 ? (
                <p>{`${post.content.slice(0, 100)}...`} <Link to={`/Fullpost/${post.id}`} onClick={() => handlePostClick(post.id)}>Continue Reading</Link></p>
              ) : (
                <p>{post.content}</p>
              )}
              <img src={`data:image/png;base64,${post.post_thumbnail}`} alt="Post Thumbnail" className="post-thumbnail"  width="100" height="100" />
              <img src={post.profile_picture ? `data:image/png;base64,${post.profile_picture}` : defaultProfileImage} alt="Profile" className="profile-image" />
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
                  <button onClick={() => handleComment(post.id)} className="comment-button">Comment</button>
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
                    <span className="comment-author" onClick={() => handleCommenterClick(comments[post.id][0].user_id)}>
    <Link to={`/viewUserProfile/${comments[post.id][0].user_id}`}>
        {comments[post.id][0].user_full_name}
    </Link>
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
    </div>
  );
};

export default ViewPosts;
