import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserRoleManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users/')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleRoleChange = (userId, role, value) => {
        axios.patch(`/api/users/${userId}/`, { [role]: value })
            .then(response => {
                setUsers(users.map(user => user.id === userId ? response.data : user));
            })
            .catch(error => console.error('Error updating role:', error));
    };

    return (
        <div>
            <h2>User Role Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Is Talent Admin</th>
                        <th>Is Company User</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={user.is_talent_admin}
                                    onChange={(e) => handleRoleChange(user.id, 'is_talent_admin', e.target.checked)}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={user.is_company_user}
                                    onChange={(e) => handleRoleChange(user.id, 'is_company_user', e.target.checked)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRoleManagement;
