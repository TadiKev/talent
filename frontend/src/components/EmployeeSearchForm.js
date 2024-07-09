import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeSearchForm.css'; 

const EmployeeSearch = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    role: '',
    department: '',
    start_date: '',
    end_date: ''
  });
  const [results, setResults] = useState([]);

  // State to store CSRF token
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/csrf-token/');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      // Construct the query parameters
      const queryParams = {};
      if (searchParams.name) queryParams.name = searchParams.name;
      if (searchParams.role) queryParams.role = searchParams.role;
      if (searchParams.department) queryParams.department = searchParams.department;
      if (searchParams.start_date) queryParams.start_date = searchParams.start_date;
      if (searchParams.end_date) queryParams.end_date = searchParams.end_date;

      // Axios request with CSRF token in headers
      const response = await axios.get('http://localhost:8000/api/search/', {
        params: queryParams,
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true // Ensure credentials (cookies) are sent
      });

      setResults(response.data);
    } catch (error) {
      console.error('Error searching employees:', error);
    }
  };

  return (
    <div className="EmployeeSearch">
      <h2>Employee Search</h2>
      <div className="input-row">
        <label>Name:</label>
        <input type="text" name="name" value={searchParams.name} onChange={handleInputChange} />
      </div>
      <div className="input-row">
        <label>Role:</label>
        <input type="text" name="role" value={searchParams.role} onChange={handleInputChange} />
      </div>
      <div className="input-row">
        <label>Department:</label>
        <input type="text" name="department" value={searchParams.department} onChange={handleInputChange} />
      </div>
      <div className="input-row">
        <label>Start Date:</label>
        <input type="text" name="start_date" value={searchParams.start_date} onChange={handleInputChange} />
      </div>
      <div className="input-row">
        <label>End Date:</label>
        <input type="text" name="end_date" value={searchParams.end_date} onChange={handleInputChange} />
      </div>
      <button onClick={handleSearch}>Search</button>

      {results.length > 0 && (
        <div className="results">
          <h3>Search Results:</h3>
          <ul>
            {results.map(employee => (
              <li key={employee.id}>
                {employee.name} - {employee.department} - {employee.role} - {employee.start_date} - {employee.end_date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;
