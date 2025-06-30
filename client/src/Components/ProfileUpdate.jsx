import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  Box, TextField, Button, Typography, InputLabel
} from '@mui/material';

export default function ProfileUpdatePage({ authToken }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [userName, setUserName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/update_profile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      }
    })
    .then((response) => {
      const userData = response.data;
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setUserName(userData.userName);
    })
    .catch((error) => {
      console.error('Failed to fetch user data:', error);
    });
  }, [authToken]);

  const updateProfile = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    if (profilePicture && !['image/jpeg', 'image/png'].includes(profilePicture.type)) {
      alert('Please select a JPEG or PNG image for the profile picture.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(profilePicture);
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];

      const requestData = {
        first_name: firstName,
        last_name: lastName,
        email,
        user_name: userName,
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
        profile_picture: base64Data,
        mimetype: profilePicture.type
      };

      axios.post('http://127.0.0.1:5000/update_profile', requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      })
      .then(() => {
        navigate("/Dashboard");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          alert(error.response.data.error);
        } else {
          alert("An error occurred. Please try again later.");
        }
      });
    };
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" mb={2}>Update Profile</Typography>
      <form onSubmit={updateProfile}>
        <TextField fullWidth margin="normal" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <TextField fullWidth margin="normal" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <TextField fullWidth margin="normal" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Box mt={2}>
          <InputLabel>Profile Picture</InputLabel>
          <input type="file" accept="image/jpeg, image/png" onChange={(e) => setProfilePicture(e.target.files[0])} />
        </Box>
        <TextField fullWidth margin="normal" label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <TextField fullWidth margin="normal" label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <TextField fullWidth margin="normal" label="Confirm New Password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        <Button fullWidth variant="contained" sx={{ mt: 3 }} type="submit">Update Profile</Button>
      </form>
    </Box>
  );
}
