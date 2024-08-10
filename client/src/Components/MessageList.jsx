import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MessageList = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
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

        const response = await axios.get(`http://localhost:5000/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            user_id: userId,
          },
        });

        setMessages(response.data);
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

  const handleReply = async (receiverId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`http://localhost:5000/messages`, {
        receiver_id: receiverId,
        content: replyMessage,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally update state or fetch messages again after replying
      console.log('Reply sent:', response.data);
    } catch (error) {
      console.error('Error replying:', error.message);
      // Handle error, show message, etc.
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Messages</h2>
      <ul className="message-list">
        {messages.map((message) => (
          <li key={message.message_id}>
            <div>{message.content}</div>
            <div>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here"
              />
              <button onClick={() => handleReply(message.receiver_id)}>Reply</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
