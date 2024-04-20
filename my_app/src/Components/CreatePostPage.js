import React, { useState } from 'react';
import axios from 'axios';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [post_thumbnail, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update state with selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post_thumbnail || !title || !content) {
      setError('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to create a post');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('post_thumbnail', post_thumbnail);

      const response = await axios.post('http://127.0.0.1:5000/create_post', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Set the correct content type for file uploads
        }
      });
      console.log('Post created successfully:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Create Post</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default CreatePost;
