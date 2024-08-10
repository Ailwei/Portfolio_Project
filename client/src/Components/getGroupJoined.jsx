import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/getGroupJoined.css'; // Import CSS file

const GetJoinedGroupsWidget = ({ handleGroupClick }) => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/groups_joined', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        
        setJoinedGroups(response.data.groups);
        console.log('Groups Joined:', response.data.groups);
      } catch (error) {
        console.error('Error fetching joined groups:', error);
      }
    };

    fetchJoinedGroups();
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
      setJoinedGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <div className="joined-groups-widget">
      <h3>Groups Joined</h3>
      <ul>
        {joinedGroups.map(group => (
          <li key={group.id}>
            <Link to={`/get_group/${group.id}`} onClick={() => handleGroupClick(group.id)}>{group.name}</Link>
            <button onClick={() => leaveGroup(group.id)}>Leave</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetJoinedGroupsWidget;
