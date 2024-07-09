import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SingleEntryForm.css';

const SingleEntryForm = () => {
  const initialEmployeeState = {
    name: '',
    employee_id: '',
    department: '',
    role: '',
    start_date: '',
    end_date: '',
    duties: '',
    company: '',
    id: null
  };

  const [employeeData, setEmployeeData] = useState(initialEmployeeState);
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
      [name]: value || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrftoken = getCookie('csrftoken');

      const response = await axios.post(
        'http://localhost:8000/api/employees/',
        employeeData,
        {
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Employee added:', response.data);
      alert('Employee added successfully!');

      setEmployeeData({
        ...employeeData,
        id: response.data.id
      });

    } catch (error) {
      console.error('Error adding employee:', error.response.data);
      alert('Error adding employee!');
    }
  };

  const handleDelete = async () => {
    if (!employeeData.id) {
      alert('No employee selected to delete.');
      return;
    }

    try {
      const csrftoken = getCookie('csrftoken');

      const response = await axios.delete(
        `http://localhost:8000/api/employees/${employeeData.id}/`,
        {
          headers: {
            'X-CSRFToken': csrftoken,
          },
          withCredentials: true,
        }
      );

      console.log('Employee deleted:', response.data);
      alert('Employee deleted successfully!');
      setEmployeeData(initialEmployeeState);
    } catch (error) {
      console.error('Error deleting employee:', error.response.data);
      alert('Error deleting employee!');
    }
  };

  const fetchEmployeeById = async () => {
    if (!employeeData.employee_id) {
      alert('Please enter an Employee ID.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/employees/${employeeData.employee_id}/`
      );

      const fetchedEmployee = response.data;
      setEmployeeData({
        ...fetchedEmployee,
        id: fetchedEmployee.id
      });

    } catch (error) {
      console.error('Error fetching employee:', error.response.data);
      alert('Employee with specified ID not found.');
    }
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={employeeData.name || ''} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="employee_id" value={employeeData.employee_id || ''} onChange={handleChange} placeholder="Employee ID" required />
        <input type="number" name="department" value={employeeData.department || ''} onChange={handleChange} placeholder="Department ID" required />
        <input type="text" name="role" value={employeeData.role || ''} onChange={handleChange} placeholder="Role" required />
        <input type="date" name="start_date" value={employeeData.start_date || ''} onChange={handleChange} placeholder="Start Date" required />
        <input type="date" name="end_date" value={employeeData.end_date || ''} onChange={handleChange} placeholder="End Date" />
        <textarea name="duties" value={employeeData.duties || ''} onChange={handleChange} placeholder="Duties" required></textarea>
        <input type="text" name="company" value={employeeData.company || ''} onChange={handleChange} placeholder="Company" required />
        <button type="submit">Add Employee</button>
        <button type="button" onClick={fetchEmployeeById}>Fetch Employee Data</button>
        {employeeData.id && (
          <button type="button" onClick={handleDelete}>Delete Employee</button>
        )}
      </form>
    </div>
  );
};
     
export default SingleEntryForm;
