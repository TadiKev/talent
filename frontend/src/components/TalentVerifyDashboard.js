import React from 'react';
import { Link } from 'react-router-dom';

const TalentVerifyDashboard = () => {
  return (
    <div>
      <h2>Talent Verify Dashboard</h2>
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
        <li>
          <Link to="/talent-verify/update-company">Update Company</Link>
        </li>
        <li>
          <Link to="/talent-verify/bulk-update">Bulk Update</Link>
        </li>
      </ul>
    </div>
  );
};

export default TalentVerifyDashboard;
