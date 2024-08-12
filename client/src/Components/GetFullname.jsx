import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetFullName = ({}) => {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('https://13.53.199.9/view_current_user_profile');
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