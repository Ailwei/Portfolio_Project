import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GetGroupWidget from './GetGroupWidget';
import GetJoinedGroupsWidget from './getGroupJoined';

const ViewGroup = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingJoinedGroups, setLoadingJoinedGroups] = useState(true);
  const [errorGroup, setErrorGroup] = useState(null);
  const [errorJoinedGroups, setErrorJoinedGroups] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`http://localhost:5000/get_group/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGroup(response.data.group);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchJoinedGroups = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`http://localhost:5000/joined_groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Group details response:', response.data);
        setJoinedGroups(response.data.groups);
        setLoadingJoinedGroups(false);
      } catch (error) {
        setErrorJoinedGroups(error.message);
        setLoadingJoinedGroups(false);
      }
    };

    fetchJoinedGroups();
    fetchGroupDetails();
  }, [groupId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!group) {
    return <div>No group details available</div>;
  }

  return (
    <div>
      <h2>{group.group_name}</h2>
      <p>{group.user_role}</p>
      <p>{group.description}</p>
      <h3>Members:</h3>
      {group.memberships && group.memberships.length > 0 ? (
        <ul>
          {group.memberships.map(membership => (
            <li key={membership.user_id}>
              {membership.user_name || 'Unknown User'}
            </li>
          ))}
        </ul>
      ) : (
        <div>No members available</div>
      )}
    </div>
  );
};

export default ViewGroup;
