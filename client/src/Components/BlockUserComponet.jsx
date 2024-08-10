import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlockUserComponent = ({ authToken }) => {
    const [authToken, setAuthToken] = useEffect('')
    const [userId, setUserId] = useState('');
    const [action, setAction] = useState('block');

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            setAuthToken(token)
        }
         }, [])

    const handleActionChange = (e) => {
        setAction(e.target.value);
    };


    const handleUserAction = async () => {
        try {
            let response;
            if (action === 'block') {
                response = await axios.post('127.0.0.1/block-user', { user_id: userId }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            } else {
                response = await axios.post('127.0.0.1/unblock-user', { user_id: userId }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            }
            console.log(response.data.message);
            // Handle success
        } catch (error) {
            console.error('Error performing user action:', error);
            // Handle error
        }
    };

    return (
        <div>
            <h2>{action === 'block' ? 'Block User' : 'Unblock User'}</h2>
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
            />
            <select value={action} onChange={handleActionChange}>
                <option value="block">Block</option>
                <option value="unblock">Unblock</option>
            </select>
            <button onClick={handleUserAction}>{action === 'block' ? 'Block' : 'Unblock'} User</button>
        </div>
    );
};

export default BlockUserComponent;
