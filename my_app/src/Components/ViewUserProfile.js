import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaEnvelope, FaBan, FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import '../styles/ViewUserProfile.css'

const ViewUserProfile = (LandingPage) => {
  const [profile, setProfile] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const { userId, groupId } = useParams();
 

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/view_user_profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [userId, authToken]);

  const handleBlockUserorUnblockUser = async () => {
    try {
      if (profile.blocked) {  
        const response = await axios.post(`http://127.0.0.1:5000/unblock_user`,
          { user_id: userId, group_id: groupId }, // Use unblock_user endpoint
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );
        console.log('User unblocked:', response.data);
      } else {
        const response = await axios.post(`http://127.0.0.1:5000/block_user`,
          { user_id: userId, group_id: groupId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );
        console.log('User blocked:', response.data);
      }
    } catch(error) {
      console.error('Error blocking/unblocking user', error);
    }
  };
  

  const handleMessageUser = async () => {
    setShowMessageInput(!showMessageInput);
  };

  const handleSendMessage = async () => {
  try {
    const response = await axios.post(`http://127.0.0.1:5000/send_message/${userId}`, {
      user_id: userId,
      content: messageContent
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Message sent:', response.data);
    // Clear message content and hide input field after sending
    setMessageContent('');
    setShowMessageInput(false);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-info">
        <img src={profile.profilePicture} alt="Profile" />
        <h2>{profile.fullName}</h2>
        <p>{profile.bio}</p>
      </div>
      <div className="profile-actions">
      {profile.blocked ? (
          <button onClick={handleBlockUserorUnblockUser}><FaCheckCircle /> Unblock</button>
        ) : (
          <button onClick={handleBlockUserorUnblockUser}><FaBan /> Block</button>
        )}
        <button onClick={handleMessageUser}><FaEnvelope /> Message</button>
        <button><FaUserPlus /> Follow</button>
      </div>
      {showMessageInput && (
        <div className="message-input">
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
      <div className="profile-groups">
        <h3>Groups</h3>
        <ul>
          {profile.groups.map(group => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      </div>
      <div className="profile-memberships">
        <h3>Memberships</h3>
        <ul>
          {profile.memberships.map(membership => (
            <li key={membership.id}>{membership.groupName}</li>
          ))}
        </ul>
      </div>
      <div className="profile-owned-groups">
        <h3>Owned Groups</h3>
        <ul>
          {profile.ownedGroups.map(group => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewUserProfile;
