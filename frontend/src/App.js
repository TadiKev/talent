import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; // Import Navigate from react-router-dom
import EmployeeForm from './components/SingleEntryForm';
import EmployeeList from './components/EmployeeList';
import FileUpload from './components/FileUpload';
import EmployeeSearchForm from './components/EmployeeSearchForm';
import TalentVerifyUpdateCompanyForm from './components/TalentVerifyUpdateCompanyForm';
import TalentVerifyBulkUpdateForm from './components/TalentVerifyBulkUpdateForm';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Sidebar from './components/Sidebar'; // Assuming Sidebar.js exists in './components'
import UserRoleManagement from './components/UserRoleManagement'; // Import UserRoleManagement component
import './App.css'; // Import global styles

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(false); // Ensure user is logged out after signup
    return <Navigate to="/login" />; // Redirect to login page
  };

  return (
    <Router>
      <div className="app-container">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/signup" element={<SignUpForm onSuccess={handleSignUpSuccess} />} />
            <Route path="*" element={<LoginForm onLogin={handleLoginSuccess} />} />
          </Routes>
        ) : (
          <>
            <Sidebar /> {/* Render Sidebar component */}
            <div className="main-content">
              <Routes>
                <Route path="/company/add-employee" element={<EmployeeForm />} />
                <Route path="/company/employees" element={<EmployeeList />} />
                <Route path="/company/upload" element={<FileUpload />} />
                <Route path="/company/search-employees" element={<EmployeeSearchForm />} />
                <Route path="/talent-verify/update-company" element={<TalentVerifyUpdateCompanyForm />} />
                <Route path="/talent-verify/bulk-update" element={<TalentVerifyBulkUpdateForm />} />
                <Route path="/user-role-management" element={<UserRoleManagement />} /> {/* Add UserRoleManagement route */}
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

const Home = () => (
  <div className="home-content">
    <h2>Welcome to Talent Verify</h2>
    <ul>
      <li><Link to="/company/add-employee">Add Employee</Link></li>
      <li><Link to="/company/employees">Employee List</Link></li>
      <li><Link to="/company/upload">Upload Employee Data</Link></li>
      <li><Link to="/company/search-employees">Search Employees</Link></li>
      <li><Link to="/talent-verify/update-company">Update Company</Link></li>
      <li><Link to="/talent-verify/bulk-update">Bulk Update</Link></li>
      <li><Link to="/user-role-management">User Role Management</Link></li> {/* Add link to UserRoleManagement */}
    </ul>
  </div>
);

export default App;
