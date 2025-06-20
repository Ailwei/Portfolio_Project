import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetFullName = () => {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('No auth token found');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/view_current_user_profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFullName(response.data.fullName);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return <p>{fullName}</p>;
};

export default GetFullName;
