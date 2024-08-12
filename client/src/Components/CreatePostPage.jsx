import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Createpost.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [post_thumbnail, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !post_thumbnail) {
      setError('All fields are required');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to create a post');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('post_thumbnail', post_thumbnail);

      const response = await axios.post('https://13.53.199.9/create_post', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setTitle('');
      setContent('');
      setFile(null);
      setSuccess('Post created successfully!');
    } catch (error) {
      setError('Error creating post. Please try again.');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea 
            placeholder="Content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            className="form-control"
          ></textarea>
        </div>
        <div className="form-group">
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}

export default CreatePost;
