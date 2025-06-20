import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReceiveMessage = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = () => {
      const token = localStorage.getItem('authToken');
      return token;
    };

    const fetchMessages = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://127.0.0.1:5000/get_messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(response.data);
        console.log('Messages:', response.data.messages);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError(error.message || 'Error fetching messages');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate, userId]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiveMessage;
