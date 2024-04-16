import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MessageList = () => {
  const { userId } = useParams();

  const getToken = () => localStorage.getItem('authToken');

  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async (userId) => {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`http://localhost:5000/get_messages/${userId}`, { headers });
        const receivedMessages = response.data.messages;
        setMessages(receivedMessages);
        
        // Filter unread messages
        const unread = receivedMessages.filter(message => !message.is_read);
        setUnreadMessages(unread);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [userId]);

  const markAsRead = async (messageId) => {
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.patch(`http://localhost:5000/get_messages/${messageId}/mark-as-read`, null, { headers });
      const updatedMessages = messages.map(message =>
        message.message_id === messageId ? { ...message, is_read: true } : message
      );
      setMessages(updatedMessages);
      
      // Remove message from unreadMessages state
      const updatedUnread = unreadMessages.filter(message => message.message_id !== messageId);
      setUnreadMessages(updatedUnread);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="message-list">
      <h2>Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message.message_id}>
            <div>{message.content}</div>
            <div>{message.created_at}</div>
            <div>{message.is_sender_inbox ? 'Inbox' : 'Sent'}</div>
            {!message.is_read && (
              <button onClick={() => markAsRead(message.message_id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
      {unreadMessages.length > 0 && (
        <div>
          <h3>Unread Messages:</h3>
          <ul>
            {unreadMessages.map(message => (
              <li key={message.message_id}>{message.content}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MessageList;
