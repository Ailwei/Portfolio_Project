import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaEnvelope, FaBan } from 'react-icons/fa';
import defaultProfileImage from './images/profile_default.png';

const ViewProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/view_current_user_profile', {
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

  const handleBlockUser = async () => {
    // Implement blocking user logic
  };

  const handleMessageUser = async () => {
    // Implement messaging user logic
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-info">
      <img src={profile.profile_picture ? `data:image/png;base64,${profile.profile_picture}` : defaultProfileImage} alt="Profile" className="profile-image" />
        <h2>{profile.fullName}</h2> {/* Replace username with fullName */}
        <p>{profile.bio}</p>
      </div>
      <div className="profile-actions">
        <button onClick={handleBlockUser}><FaBan /> Block</button>
        <button onClick={handleMessageUser}><FaEnvelope /> Message</button>
        <button><FaUserPlus /> Follow</button> {/* Add follow button */}
      </div>
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

export default ViewProfile;
