import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupsComponent = ({ currentUser }) => {
    const [groups, setGroups] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Retrieve authentication token from local storage when component mounts
        const authtoken = localStorage.getItem('authToken');
        if (authtoken) {
            setToken(authtoken);
        } else {
            console.error('You must login to perform the action');
        }
    }, []);

    useEffect(() => {
        fetchGroups(token);
    }, [token]);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/groups', {
                headers: {
                    Authoriation: `Bearer ${token}`
                }
            });
            setGroups(response.data.groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };
    const isMember = (group) => {
        return (
            group &&
            group.members &&
            currentUser &&
            group.members.some(member => member.user_id === currentUser.user_id)
        );
    };

    const joinGroup = async (groupId) => {
        try {
            console.log("Group ID:", groupId);
            await axios.post('http://127.0.0.1:5000/join_group', { group_id: groupId } , {
                headers: {
                    Authoriation: `Bearer ${token}`
                }
            });
            fetchGroups();
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    const leaveGroup = async (groupId) => {
        try {
            await axios.post('http://127.0.0.1:5000/leave_group', {
                headers: {
                    Authoriation: `Bearer ${token}`
                }
            })
            fetchGroups();
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    return (
        <div>
            <h2>All Groups</h2>
            {groups.map((group) => (
                <div key={group.group_id}>
                    <h3>{group.group_name}</h3>
                    {!isMember(group) && (
                        <button onClick={() => joinGroup(group.group_id)}>Join</button>
                    )}
                    {isMember(group) && (
                        <button onClick={() => leaveGroup(group.group_id)}>Leave</button>
                    )}
                    {isMember(group) && (
                        <button>View Group</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GroupsComponent;
