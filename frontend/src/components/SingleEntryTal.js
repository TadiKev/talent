import React, { useState, useEffect } from 'react';
import './SingleEntryTal.css';
import axios from 'axios';

const SingleEntryForm = () => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    employee_id: "",
    department: "",
    role: "",
    start_date: "",
    end_date: "",
    duties: "",
    company: ""
  });

  

  const [csrfToken, setCsrfToken] = useState('');

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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value
    });
  };

 



  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const csrftoken = getCookie('csrftoken');  // Adjust this function based on your token retrieval method
  
          const response = await axios.post(
              'http://localhost:8000/api/employees/',
              employeeData,
              {
                  headers: {
                      'X-CSRFToken': csrftoken,
                      'Content-Type': 'application/json',
                  },
                  withCredentials: true,  // Ensure credentials are sent with the request
              }
          );
  
          console.log('Employee added:', response.data);
      } catch (error) {
          console.error('Error adding employee:', error.response.data);
      }
  };
  
  // Function to get CSRF token from cookies
  function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
  
  

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={employeeData.name} onChange={handleChange} placeholder="Name" />
      <input type="text" name="employee_id" value={employeeData.employee_id} onChange={handleChange} placeholder="Employee ID" />
      <input type="number" name="department" value={employeeData.department} onChange={handleChange} placeholder="Department ID" />
      <input type="text" name="role" value={employeeData.role} onChange={handleChange} placeholder="Role" />
      <input type="date" name="start_date" value={employeeData.start_date} onChange={handleChange} placeholder="Start Date" />
      <input type="date" name="end_date" value={employeeData.end_date} onChange={handleChange} placeholder="End Date" />
      <input type="text" name="duties" value={employeeData.duties} onChange={handleChange} placeholder="Duties" />
      <input type="text" name="company" value={employeeData.company} onChange={handleChange} placeholder="Company" />
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default SingleEntryForm;
