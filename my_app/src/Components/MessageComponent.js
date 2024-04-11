import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MessageComponent.css';

function MessageComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/inbox');
      setMessages(response.data.inbox_messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (userId) => {
    try {
      await axios.post(`/send_message/${userId}`, { content: newMessageContent });
      setNewMessageContent('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReply = async (messageId) => {
    try {
      await axios.post(`/messages/${messageId}/reply`, { content: replyContent });
      setReplyContent('');
      fetchMessages();
    } catch (error) {
      console.error('Error replying to message:', error);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <div>
        <h3>Inbox</h3>
        <ul>
          {messages.map(message => (
            <li key={message.id}>
              From: {message.sender_id} - {message.content}
              <button onClick={() => handleReply(message.id)}>Reply</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Send Message</h3>
        <input
          type="text"
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          placeholder="Enter message content"
        />
        <button onClick={() => handleSendMessage()}>Send</button>
      </div>
      <div>
        <h3>Reply</h3>
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Enter reply content"
        />
      </div>
    </div>
  );
}

export default MessageComponent;
