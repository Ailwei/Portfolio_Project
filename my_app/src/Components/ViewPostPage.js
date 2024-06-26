import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart,FaUserMinus, FaRegHeart, FaComment, FaUserPlus } from 'react-icons/fa';
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
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [reactions, setReactions] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [likesCountPerPost, setLikesCountPerPost] = useState({});
  

  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setToken(token);
    }
    fetchPosts();
  }, [currentPage, authToken]);

  useEffect(() => {
    fetchFollowedUsers();
    
  }, []);

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
      fetchReactions(postIds);
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
 
  const handleReaction = async (postId) => {
    try {
       // Toggle like state for the post
       const isLiked = !likedPosts[postId] || !likedPosts[postId].clicked;
       console.log('isLiked:', isLiked);
      
      const response = await axios.post(`http://127.0.0.1:5000/reactions`,  
      {
        user_id: currentUserId,
        post_id: postId,
        created_at: new Date().toISOString(),
        activity_type: isLiked ? 1 : 0
      }, 
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setLikedPosts(prevLikedPosts => ({
        ...prevLikedPosts,
        [postId]: { clicked: isLiked }
    }))
      console.log('Reaction created:', response.data);
      fetchReactions([postId]);
    } catch (error) {
      console.error('Error creating reaction:', error);
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
  const fetchReactions = async (postIds) => {
    try {
      const reactionsResponse = await Promise.all(postIds.map(postId => axios.get(`http://127.0.0.1:5000/posts/${postId}/reactions`)));
      const reactionsData = reactionsResponse.reduce((acc, response, index) => {
        acc[postIds[index]] = response.data;
        return acc;
      }, {});
  
      // Calculate total likes for each post
      const likesCountPerPost = Object.keys(reactionsData).reduce((acc, postId) => {
        const postReactions = reactionsData[postId];
        const likesCount = postReactions.filter(reaction => reaction === 1).length;
        acc[postId] = likesCount;
        return acc;
      }, {});
  
      
      console.log('Reactions Data:', reactionsData);
  
      // Update state with reactions data
      setLikedPosts(reactionsData);
  
      // Update likes count per post state while preservin
      const updatedLikesCountPerPost = {
        ...likesCountPerPost,
        ...likesCountPerPost,
      };
      setLikesCountPerPost(updatedLikesCountPerPost);
      console.log('Likes Count Per Post:', updatedLikesCountPerPost);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };
  
  const fetchFollowedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/followed_users', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setFollowedUsers(response.data.followed_users);
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const handleFollow = async (userId) => {
    if (userId) {
      if (followedUsers.includes(userId)) {
        // User is already followed, unfollow them
        await axios.post(`http://localhost:5000/unfollow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        // Update followedUsers state after unfollowing
        setFollowedUsers(followedUsers.filter(id => id !== userId));
      } else {
        // User is not followed, follow them
        await axios.post(`http://localhost:5000/follow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        // Update followedUsers state after following
        setFollowedUsers([...followedUsers, userId]);
      }
    } else {
      console.error('Invalid user ID to follow/unfollow');
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
      <button 
    onClick={() => handleReaction(post.id)} 
    className="reaction-button"
    style={{ color: likedPosts[post.id] && likedPosts[post.id].clicked ? 'red' : 'black' }} >

    {likedPosts[post.id] && likedPosts[post.id].clicked ? <FaHeart /> : <FaRegHeart />}
    <span className="like-count">{likesCountPerPost[post.id] || 0}</span>
</button>

        <FaComment onClick={() => toggleCommentBox(post.id)} className="comment-icon" />
              {commentingPostId === post.id && (
                <div className="comment-box">
                  <input type="text" placeholder="Add a comment..." className="comment-input" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                  <button onClick={() => handleComment(post.id)} className="comment-button">Comment</button>
                </div>
              )}
              <button onClick={() => handleFollow(post.user_id)} className="follow-button">
              {followedUsers.includes(post.user_id) ? (
                <FaUserMinus /> // If user is followed, show unfollow icon
              ) : (
                <FaUserPlus /> // If user is not followed, show follow icon
              )}
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
