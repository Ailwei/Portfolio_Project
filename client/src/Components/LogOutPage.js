
import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    // Clear the authentication token from local storage (assuming you're using localStorage)
    localStorage.removeItem('authToken');
    // Redirect the user to the login page or any other desired location
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
