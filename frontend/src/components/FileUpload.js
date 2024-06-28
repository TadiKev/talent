import React, { useState, useEffect } from 'react';
import './FileUpload.css'; // Import your external CSS file
import axios from 'axios';


const FileUploadComponent = () => {
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

    // Inline styles for success and error messages
    const successStyle = {
        color: 'green',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '20px',
    };

    const errorStyle = {
        color: 'red',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '20px',
    };

    return (
        <div className="file-upload-container">
            <h2 className="file-upload-title">Upload Employee Information</h2>
            <input className="file-upload-input" type="file" onChange={handleFileChange} />
            <button className="file-upload-button" onClick={handleUpload}>Upload</button>
            {/* Display success or error message if available */}
            {message && (
                <div style={isError ? errorStyle : successStyle}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileUploadComponent;
