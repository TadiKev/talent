// src/axiosInstance.js (or wherever you've defined your axios instance)

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/', // Adjust port number as per your Django backend configuration
  timeout: 5000, // Adjust timeout as needed
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers as needed
  }
});

export default axiosInstance;
