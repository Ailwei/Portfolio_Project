import React, { useState } from 'react';

const GroupPost = ({ groupId, userId }) => {
  const [content, setContent] = useState('');

  const handlePostSubmit = () => {
    console.log(`Posting to group ${groupId}: ${content}`);
  };

  return (
    <div>
      <h3>Create a Post in Group</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
      />
      <button onClick={handlePostSubmit}>Post</button>
    </div>
  );
};

export default GroupPost;