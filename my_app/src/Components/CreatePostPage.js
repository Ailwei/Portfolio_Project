import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Createpoststyle.css';

function CreatePostPage({ group_id, history }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postThumbnail, setPostThumbnail] = useState(null);
  const [errorPost, setErrorPost] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setErrorPost('Title and content are required');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrorPost('You must be logged in to create a post');
        return;
      }

      const requestData = {
        title,
        content,
        group_id,
        post_thumbnail: postThumbnail ? await convertFileToBase64(postThumbnail) : null
      };

      const response = await axios.post(
        'http://localhost:5000/create_post',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.error) {
        setErrorPost(response.data.error);
      } else {
        setErrorPost('');
        setTitle('');
        setContent('');
        setPostThumbnail(null);
        setIsFormVisible(false); 
        setErrorPost('Post created successfully:', response.data.message);
        navigate('../Dashboard');
      }
      
    } catch (error) {
      setErrorPost('Error: ' + error.message);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleThumbnailChange = (e) => {
    setPostThumbnail(e.target.files[0]);
  };

  return (
    <div className="post-container">
     
        <form className="post-form" onSubmit={handleSubmit}> 
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
          <div className="mb-3">
            <label htmlFor="postThumbnail" className="form-label">Thumbnail (optional)</label>
            <input type="file" className="form-control" id="postThumbnail" onChange={handleThumbnailChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
      {errorPost && <p className="error">{errorPost}</p>}
    </div>
  );
}

export default CreatePostPage;