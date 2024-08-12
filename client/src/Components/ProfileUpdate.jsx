import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"

export default function ProfileUpdatePage({ authToken }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [userName, setUserName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    const fetchUserData = () => {
        axios.get('http://13.53.199.9/update_profile', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        })
        .then(function (response) {
            const userData = response.data;
            setFirstName(userData.first_name);
            setLastName(userData.last_name);
            setEmail(userData.email);
            setUserName(userData.userName);
        })
        .catch(function (error) {
            console.error('Failed to fetch user data:', error);
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const updateProfile = () => {
        if (newPassword !== confirmNewPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        if (!profilePicture || !['image/jpeg', 'image/png'].includes(profilePicture.type)) {
            alert('Please select a JPEG or PNG image for the profile picture.');
            return;
        }

        // Convert the file to base64
    const reader = new FileReader();
    reader.readAsDataURL(profilePicture);
    reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];

        const requestData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            user_name: userName,
            current_password: currentPassword,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword,
            profile_picture: base64Data,
            mimetype: profilePicture.type
        };

        axios.post('http://13.53.199.9/update_profile', requestData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        })
        .then(function (response) {
            navigate("/Dashboard");
        })
        .catch(function (error) {
            if (error.response.status === 401) {
                alert(error.response.data.error);
            } else {
                alert("An error occurred. Please try again later.");
            }
        });
        }
    }

    return (
        <div>
            <h1>Update Profile</h1>
            <form onSubmit={updateProfile}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                    <input type="file" className="form-control" id="profilePicture" onChange={(e) => setProfilePicture(e.target.files[0])} />
                </div>
                <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
    
    }