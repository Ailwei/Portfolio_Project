import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../styles/GetGroupWidget.css';
import { AiOutlineConsoleSql } from 'react-icons/ai';

const GetGroupWidget = (group_id) => {
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
        if (response && response.data && response.data.groups) {
          // Filter out the groups the user is not a member of
          
            const filteredGroups = response.data.groups.filter(group => group.isMember);
            setUserGroups(filteredGroups);
          }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, [authToken]);


  const leaveGroup = async (group_id) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/leave_group', {
    
        group_id: group_id
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      });
      console.log(response.data.message); 
      setUserGroups(prevGroups => prevGroups.filter(group => group.id !== group_id));
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <div className="group-widget">
    <h2>My Groups</h2>
      <ul>
        {userGroups.length > 0 ? (
          userGroups.map(group => (
            <li key={group.id}>
              <Link to={`/group/${group.id}`} className="group-link">{group.name}</Link>
              <button className="leave-button" onClick={() => leaveGroup(group.id)}>Leave</button>
            </li>
          ))
        ) : (
          <li>No groups found</li>
        )}
      </ul>
    </div>
  );
};

export default GetGroupWidget;
