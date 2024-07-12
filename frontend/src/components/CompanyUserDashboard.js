import React from 'react';
import { Link } from 'react-router-dom';

const CompanyUserDashboard = () => {
  return (
    <div>
      <h2>Company User Dashboard</h2>
      <ul>
        <li>
          <Link to="/company/add-employee">Add Employee</Link>
        </li>
        <li>
          <Link to="/company/upload">Upload Employee Data</Link>
        </li>
        <li>
          <Link to="/company/search-employees">Search Employees</Link>
        </li>
      </ul>
    </div>
  );
};

export default CompanyUserDashboard;
