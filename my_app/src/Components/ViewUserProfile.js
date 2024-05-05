import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaEnvelope,FaUserMinus, FaBan, FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import defaultProfileImage from '../images/profile_default.png';
import '../styles/ViewUserProfile.css';


const ViewUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [followedUsers, setFollowedUsers] = useState([]);
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
        setFollowedUsers(response.data.following);
        console.log('Fetched profile data:', response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [userId, authToken]);

  useEffect(() => {
    fetchFollowedUsers();

  }, [authToken]);

  const handleBlockUserorUnblockUser = async () => {
    try {
      const response = profile.blocked ? 
        await axios.post(`http://127.0.0.1:5000/unblock_user`, { user_id: userId, group_id: groupId }, { headers: { Authorization: `Bearer ${authToken}` } }) :
        await axios.post(`http://127.0.0.1:5000/block_user`, { user_id: userId, group_id: groupId }, { headers: { Authorization: `Bearer ${authToken}` } });

      console.log(profile.blocked ? 'User unblocked:' : 'User blocked:', response.data);
    } catch(error) {
      console.error('Error blocking/unblocking user', error);
    }
  };

  const handleMessageUser = () => {
    setShowMessageInput(!showMessageInput);
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/send_message/${userId}`, { user_id: userId, content: messageContent }, { headers: { Authorization: `Bearer ${authToken}` } });
      console.log('Message sent:', response.data);
      setMessageContent('');
      setShowMessageInput(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const fetchFollowedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/followed_users', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setFollowedUsers(response.data.followed_users);
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const handleFollow = async () => {

    const userId = profile && profile.userId;
    console.log(userId)
    if (userId) {
      console.log('userId parameter:', userId);

      if (followedUsers.includes(profile.userId)) {
        await axios.post(`http://localhost:5000/unfollow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setFollowedUsers(prevFollowedUsers => {
          console.log("Unfollowed Users:", prevFollowedUsers.filter(id => id !== userId));
          return prevFollowedUsers.filter(id => id !== userId);
        });
        //setFollowedUsers(prevFollowedUsers => prevFollowedUsers.filter(id => id !== userId));
        // setFollowedUsers(followedUsers.filter(id => id !== userId));
      } else {
        // User is not followed, follow them
        await axios.post(`http://localhost:5000/follow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setFollowedUsers(prevFollowedUsers => {
          console.log("Followed Users:", [...prevFollowedUsers, userId]);
          return [...prevFollowedUsers, userId];
        });
       // setFollowedUsers(prevFollowedUsers => [...prevFollowedUsers, userId]); 
        //setFollowedUsers([...followedUsers, userId]);
      }
    } else {
      console.error('Invalid user ID to follow/unfollow');
    }
    }

  
  if (!profile) {
    return <div>Loading...</div>;
  }
  return (
    <div className="profile">
      <div className="profile-info">
      <img src={profile.profile_picture ? `data:image/png;base64,${profile.profile_picture}` : defaultProfileImage} alt="Profile" />

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
        <button onClick={ handleFollow} data-user-id={profile.id} className="follow-button">
  {followedUsers && followedUsers.includes(profile.id) ? (
    <>
      <FaUserMinus />
      
    </>
  ) : (
    <>
      <FaUserPlus />
      
    </>
  )}
</button>
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
