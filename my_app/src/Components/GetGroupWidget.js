import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GetGroupWidget = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/view_current_user_profile', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setUserGroups(response.data.groups);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, [authToken]);

  const leaveGroup = async (groupId) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/leave_group', {
        group_id: groupId
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      });
      console.log(response.data.message);
      setUserGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <div>
      <h3>My Groups</h3>
      <ul>
        {userGroups.map(group => (
          <li key={group.id}>
            <Link to={`/group/${group.id}`}>{group.name}</Link>
            <button onClick={() => leaveGroup(group.id)}>Leave</button> {/* Button to leave the group */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetGroupWidget;
