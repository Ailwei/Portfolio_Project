import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaUserPlus } from 'react-icons/fa';
import defaultProfileImage from '../images/profile_default.png';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../styles/Fullpost.css'

const Fullpost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get_post/${postId}`);
        setPost(response.data);
        const commentsResponse = await axios.get(`http://127.0.0.1:5000/get_comments/${postId}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/like/${postId}`);
      console.log('Post liked:', response.data);
      // You may want to update the post data here if needed
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/add_comment/${postId}`, { comment: commentContent });
      console.log('Comment added:', response.data);
      // You may want to update the comments data here if needed
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="full-post-container">
    
      {post && (
        <>
          <div>
            <img src={post.profilePictureUrl || defaultProfileImage} alt="Profile" className="profile-image" />
            {post.author_full_name ? (
              <button onClick={() => navigate(`/viewUserProfile/${post.user_id}`)}>
                {post.author_full_name}
              </button>
            ) : (
              <span>Unknown Author</span>
            )}
          </div>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={handleLike} className="like-button">
            {post.liked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <FaComment className="comment-icon" />
          <div className="comment-box">
            <input type="text" placeholder="Add a comment..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
            <button onClick={handleComment}>Comment</button>
          </div>
          <div className="post-comments-summary">
            Comments ({comments.length})
          </div>
          <div className="post-comments-expanded">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">
                    <Link to={`/viewUserProfile/${comment.user_id}`}>
                      {comment.user_full_name}
                    </Link>
                  </span>
                  <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                <div className="comment-content">
                  <p>{comment.comment}</p>
                </div>
              </div>
              
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Fullpost;
