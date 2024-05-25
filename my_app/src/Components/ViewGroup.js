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
  const [memberships, setMemberships] = useState([]);

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

    const fetchGroupMemberships = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/joined_groups/${groupId}`);
        setMemberships(response.data.group.memberships);
      } catch (error) {
        console.error('Error fetching group memberships:', error);
      }
    };


    fetchGroupMemberships();
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
    <p>{group.description}</p>
    <h3>Members:</h3>
    <ul>
      {memberships.map((membership) => (
        <li key={membership.user_id}>
          {membership.full_name} - {membership.user_role}
        </li>
      ))}
    </ul>
  </div>
);
};

export default ViewGroup;
