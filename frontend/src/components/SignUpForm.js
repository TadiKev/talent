import React, { useState } from 'react';
import './SignUpForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const SignUpForm = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    axiosInstance.interceptors.request.use(config => {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            config.headers['X-CSRFToken'] = csrftoken;
        }
        return config;
    });

    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }

    const handleSignUp = async () => {
        try {
            const response = await axiosInstance.post('/api/signup/', { username, password, email });
            console.log('Sign-up response:', response.data);
            onSuccess(); // Call onSuccess callback if needed
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Sign-up error:', error);
            setError('Failed to sign up. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form">
                <h2>Sign Up</h2>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {error && <p className="error-message">{error}</p>}
                <button type="button" onClick={handleSignUp}>Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpForm;
