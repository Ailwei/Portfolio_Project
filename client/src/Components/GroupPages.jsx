import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaUserPlus, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import '../../styles/GroupPages.css'

const GroupPages = () => {
  const [groupData, setGroupData] = useState({
    group: '',
    description: '',
    group_id: '',
    user_id: '',
    post_id: '',
    newUserId: '',
  });
  const [token, setToken] = useState('')

  useEffect(() => {
    const authtoken = localStorage.getItem('authToken')
    if (authtoken) {
      setToken(authtoken)
    } else {
      console.error('You must login to perfom the action')
    }
  }, [])

  const createGroup = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/create_group', {
        group: groupData.group,
        description: groupData.description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
      });
      console.log(response.data.message);
     
    } catch (error) {
      console.error('Error creating group:', error);
      // Handle error
    }
  };

  const joinGroup = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/join_group', {
        group_id: groupData.group_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
      });
      console.log(response.data.message);
       } catch (error) {
      console.error('Error joining group:', error);
      // Handle error
    }
  };

  const leaveGroup = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/leave_group', {
        group_id: groupData.group_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error leaving group:', error);

    }
  };

  const removeUserFromGroup = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/remove_user_from_group', {
        user_id: groupData.newUserId,
        group_id: groupData.group_id,

      }, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
      });
      console.log(response.data.message);
  
    } catch (error) {
      console.error('Error removing user from group:', error);
  
    }
  };

  const removePostFromGroup = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/remove_post', {
        post_id: groupData.post_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
      });
      console.log(response.data.message);
    
    } catch (error) {
      console.error('Error removing post from group:', error);
    }
  };

  return (
    <div className="group-pages-container">
      <input
        type="text"
        value={groupData.group}
        onChange={(e) => setGroupData({ ...groupData, group: e.target.value })}
        placeholder="Group Name"
      />
      <input
        type="text"
        value={groupData.description}
        onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
        placeholder="Description"
      />
      <button onClick={createGroup}><FaPlus /> Create Group</button>

      <h2>Join/Leave Group</h2>
      <input
        type="text"
        value={groupData.group_id}
        onChange={(e) => setGroupData({ ...groupData, group_id: e.target.value })}
        placeholder="Group ID"
      />
      <button onClick={joinGroup}><FaUserPlus /> Join Group</button>
      <button onClick={leaveGroup}><FaSignOutAlt /> Leave Group</button>

      <h2>Remove User from Group</h2>
      <input
        type="text"
        value={groupData.newUserId}
        onChange={(e) => setGroupData({ ...groupData, newUserId: e.target.value })}
        placeholder="User ID"
      />
      <button onClick={removeUserFromGroup}><FaTrash /> Remove User</button>

      <h2>Remove Post from Group</h2>
      <input
        type="text"
        value={groupData.post_id}
        onChange={(e) => setGroupData({ ...groupData, post_id: e.target.value })}
        placeholder="Post ID"
      />
      <button onClick={removePostFromGroup}><FaTrash /> Remove Post</button>
    </div>
  );
};

export default GroupPages;
