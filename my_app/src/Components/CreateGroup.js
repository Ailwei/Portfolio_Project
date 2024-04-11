import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import '../styles/CreateGroupForm.css';

const CreateGroupForm = () => {
  const [groupData, setGroupData] = useState({
    group: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const authtoken = localStorage.getItem('authToken');
    if (authtoken) {
      setToken(authtoken);
    } else {
      console.error('Auth token not found in localStorage');
    }
  }, []);

  const createGroup = async () => {
    // Check if input fields are empty
    if (!groupData.group.trim() || !groupData.description.trim()) {
      setError('Group name and description cannot be empty');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/create_group',
        {
          group: groupData.group,
          description: groupData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      // Update state or show success message
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group');
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <button className="create-button" onClick={toggleForm}>
        <FaPlus /> Create Group
      </button>
      {showForm && (
        <div className="create-group-form">
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
          <button onClick={createGroup}>Create</button>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CreateGroupForm;
