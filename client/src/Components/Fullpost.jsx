import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import defaultProfileImage from './images/profile_default.png';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../../styles/Fullpost.css'

const Fullpost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`https://13.53.199.9/get_post/${postId}`,{
          headers: { Authorization: `Bearer ${token}` }
        });
        setPost(response.data);
        const commentsResponse = await axios.get(`https://13.53.199.9/get_comments/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
       });
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`https//13.53.199.9/like/${postId}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Post liked:', response.data);
    
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`https://13.53.199.9/add_comment/${postId}`,
         { comment: commentContent },
         { headers: { Authorization: `Bearer ${token}` } }
        );
      console.log('Comment added:', response.data);
      setComments([...comments, response.data]);
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="full-post-container">
      {post && (
        <>
          <div className="profile-info">
            <img src={post.profile_picture ? `data:image/png;base64,${post.profile_picture}` : defaultProfileImage} alt="Profile" className="profile-image" />
            {post.author_full_name ? (
              <button onClick={() => navigate(`/viewUserProfile/${post.user_id}`)} className="author-name">
                {post.author_full_name}
              </button>
            ) : (
              <span className="author-name">Unknown Author</span>
            )}
          </div>
          <h2 className="title">{post.title}</h2>
          <div className="post-thumbnail-container">
            <img src={`data:image/png;base64,${post.post_thumbnail}`} alt="Post Thumbnail" className="post-thumbnail" />
          </div>
          <p className="content">{post.content}</p>
          <button onClick={handleLike} className="like-button">
            {post.liked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <FaComment className="comment-icon" />
          <div className="comment-box">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="comment-input"
            />
            <button onClick={handleComment} className="comment-button">Comment</button>
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
