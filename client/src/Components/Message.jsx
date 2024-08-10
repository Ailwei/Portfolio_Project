import React from 'react';
import { useParams } from 'react-router-dom';
import SendMessage from './SendMessage';
import ReceiveMessage from './ReceiveMessage';
import MessageList from './MessageList';

const MessageComponent = () => {
  const { userId } = useParams();

  return (
    <div>
      <h2>Messages with {userId}</h2>
      <ReceiveMessage userId={userId} />
      <SendMessage userId={userId} />
      <MessageList userId={userId} />
    </div>
  );
};

export default MessageComponent;
