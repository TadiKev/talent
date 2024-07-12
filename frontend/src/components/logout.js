import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Import Navigate from react-router-dom

const getCsrfToken = async () => {
    const response = await axios.get('http://localhost:8000/api/get-csrf-token/', { withCredentials: true });
    return response.data.csrfToken;
};

const logout = async () => {
    try {
        const csrfToken = await getCsrfToken();
        const response = await axios.post('http://localhost:8000/api/logout/', null, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            withCredentials: true,
        });
        console.log('Logout successful:', response.data);
        // Navigate to the login page
        return <Navigate to="/" />;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

export default logout;
