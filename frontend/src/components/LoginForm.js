import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/csrf-token/')
            .then(response => {
                setCsrfToken(response.data.csrfToken);
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8000/api/login/',
                { username, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    withCredentials: true,
                }
            );

            console.log('Login response:', response.data);
            onLogin(username, password);
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Failed to log in. Please check your credentials.');
            } else {
                setError('Failed to log in. Please check your credentials.');
            }
        }
    };

    return (
        <div className="login-container">
            <h1>WELCOME TO TALENT VERIFY CLOUD BASED SOLUTION</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    );
};

export default LoginForm;
