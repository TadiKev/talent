// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axiosInstance.get('/employees/')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the employees!', error);
      });
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            {employee.name} - {employee.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
