import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetFullName = ({}) => {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/view_current_user_profile');
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
