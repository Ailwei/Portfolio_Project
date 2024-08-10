import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SendMessage = ({ userId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    const getToken = () => {
      const token = localStorage.getItem('authToken');
      return token;
    };

    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `http://localhost:5000/send_messages/${userId}`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewMessage('');
    } catch (error) {
      setError(error.message || 'Error sending message');
    }
  };

  return (
    <div>
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      ></textarea>
      <button onClick={handleSendMessage}>Send</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default SendMessage;