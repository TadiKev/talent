import React, { useState } from 'react';
import './SignUpForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    axiosInstance.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const handleSignUp = async (event) => {
        event.preventDefault();

        try {
            await axiosInstance.post('/api/signup/', {
                username,
                password,
                email,
            });

            onSuccess();
            navigate('/'); // Redirect to root '/' after successful signup
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Failed to sign up. Please check your details.');
            } else {
                setError('Failed to sign up. Please check your details.');
            }
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
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
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpForm;
