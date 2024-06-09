import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfileImage from '../images/profile_default.png';

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
        const response = await axios.get(`http://localhost:5000/get_friends?type=${friendType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response data:', response.data);
        setFriends(response.data);
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
    <div>
      <h2>{friendType === 'followers' ? 'Followers' : 'Following'}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.user_id}>
              <Link to={`/profile/${friend.user_id}`}>
                {friend.profile_picture !== 'default' ? (
                  <img
                    src={`data:image/jpeg;base64,${friend.profile_picture}`}
                    alt={`${friend.first_name} ${friend.last_name}`}
                    style={{ width: '50px', marginRight: '10px' }}
                  />
                ) : (
                  <img
                    src={defaultProfileImage}
                    alt={`${friend.first_name} ${friend.last_name}`}
                    style={{ width: '50px', marginRight: '10px' }}
                  />
                )}
                {friend.first_name} {friend.last_name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;