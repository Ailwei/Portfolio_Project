import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfileImage from './images/profile_default.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../../styles/getFriends.css';

const FriendsList = ({ friendType }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = () => {
      const token = localStorage.getItem('authToken');
      console.log('Retrieved token:', token);
      return token;
    };

    const fetchFriends = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error('Token is not available, redirecting to login');
          navigate('/login');
          return;
        }

        console.log(`Sending request to fetch current user ${friendType}`);
        const response = await axios.get(`http://127.0.0.1:5000/get_friends?type=${friendType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response data:', response.data);
        setFriends(response.data || []);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized, redirecting to login');
          navigate('/login');
        } else {
          setError(error.message || `Error fetching ${friendType}`);
          console.error(`Error fetching ${friendType}:`, error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [navigate, friendType]);

  return (
    <div className="friends-list-container">
      <h2>{friendType === 'followers' ? 'Followers' : 'Following'}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <ul>
          {Array.isArray(friends) && friends.length > 0 ? (
            friends.map((friend) => (
              <li key={friend.user_id}>
                <Link to={`/profile/${friend.user_id}`}>
                  <img
                    src={friend.profile_picture !== 'default' ? `data:image/jpeg;base64,${friend.profile_picture}` : defaultProfileImage}
                    alt={`${friend.first_name} ${friend.last_name}`}
                  />
                  {friend.first_name} {friend.last_name}
                  </Link>
                <Link to={`/messages/${friend.user_id}`} className="message-button">
                  <FontAwesomeIcon icon={faEnvelope} />
                </Link>
              </li>
            ))
          ) : (
            <div>No friends found</div>
          )}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
