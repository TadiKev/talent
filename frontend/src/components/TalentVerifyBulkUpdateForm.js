import React, { useState, useEffect } from 'react';
import './sharedStyles.css'; // Import shared styles
import './TalentVerifyBulkUpdateForm.css'; // Import unique styles for this component
import axios from 'axios';

const TalentVerifyBulkUpdateForm = () => {
    const [file, setFile] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false); // State to track if the message is an error

    // Function to fetch CSRF token from cookies
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = cookie.substring(name.length + 1);
                    break;
                }
            }
        }
        return cookieValue;
    };

    // Fetch CSRF token when component mounts
    useEffect(() => {
        setCsrfToken(getCookie('csrftoken'));
    }, []);

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken  // Include CSRF token if Django backend requires it
                }
            });

            console.log('File upload response:', response.data);
            setMessage('File uploaded successfully!');
            setIsError(false); // Set isError to false for success message
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('An error occurred while uploading the file.');
            setIsError(true); // Set isError to true for error message
        }
    };

    return (
        <div className="file-upload-container upload-company">
            <h2 className="file-upload-title upload-company">Upload Company Information</h2>
            <input className="file-upload-input" type="file" onChange={handleFileChange} />
            <button className="file-upload-button upload-company" onClick={handleUpload}>Upload</button>
            {/* Display success or error message if available */}
            {message && (
                <div className={`message ${isError ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default TalentVerifyBulkUpdateForm;
