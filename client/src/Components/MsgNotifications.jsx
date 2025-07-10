import React, { useEffect, useRef } from 'react';
import axios from 'axios';

const MessageNotifications = ({ userId, onNewMessage }) => {
  const lastMessageIdsRef = useRef({});

  useEffect(() => {
    if (!userId) return;

    console.log('MessageNotifications mounted with userId:', userId);

    const fetchMessages = async () => {
      console.log('Polling for messages...');
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('No auth token found, skipping fetch');
          return;
        }

        const res = await axios.get(`http://127.0.0.1:5000/get_messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const conversations = res.data.conversations || [];
        console.log('Polling response:', conversations);

        let hasNew = false;

        conversations.forEach((thread) => {
          const lastMsg = thread.messages?.[thread.messages.length - 1];
          if (!lastMsg || lastMsg.type !== 'inbox') return;

          const userKey = thread.user_id;
          const lastKnownId = lastMessageIdsRef.current[userKey];

          console.log(`User ${thread.user_name} (ID ${userKey}): lastKnownId = ${lastKnownId}, lastMsgId = ${lastMsg.message_id}`);

          if (lastKnownId === undefined) {
            lastMessageIdsRef.current[userKey] = lastMsg.message_id;
            console.log(`Initial load - setting last message ID for user: ${thread.user_name}`);
          } else if (lastKnownId !== lastMsg.message_id) {
            hasNew = true;
            lastMessageIdsRef.current[userKey] = lastMsg.message_id;
            console.log(`New message detected from user: ${thread.user_name}`);
          }
        });

        if (hasNew) {
          console.log('Triggering onNewMessage callback');
          onNewMessage();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId, onNewMessage]);

  return null;
};

export default MessageNotifications;
