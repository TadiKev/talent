import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './AuthContext'; // Import your authentication context
import Sidebar from './components/Sidebar';
import TalentVerifyDashboard from './components/TalentVerifyDashboard';
import CompanyUserDashboard from './components/CompanyUserDashboard';
import EmployeeForm from './components/SingleEntryForm';
import FileUpload from './components/FileUpload';
import EmployeeSearchForm from './components/EmployeeSearchForm';
import TalentVerifyUpdateCompanyForm from './components/TalentVerifyUpdateCompanyForm';
import TalentVerifyBulkUpdateForm from './components/TalentVerifyBulkUpdateForm';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, isLoading } = useAuth(); // Assuming useAuth provides user object

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role); // Store the user role
    // Redirect to the appropriate dashboard based on role
    if (role === 'talent_verify') {
      window.location.href = '/talent-verify-dashboard';
    } else if (role === 'company_user') {
      window.location.href = '/company-user-dashboard';
    }
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true); // Assuming signup also logs the user in
    localStorage.setItem('isLoggedIn', 'true');
    return <Navigate to="/" />;
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout/', null, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsLoggedIn(false);
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userRole'); // Remove user role on logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/signup" element={<SignUpForm onSuccess={handleSignUpSuccess} />} />
            <Route path="/" element={<LoginForm onLogin={handleLoginSuccess} />} />
          </Routes>
        ) : (
          <>
            <Sidebar onLogout={handleLogout} userRole={user ? user.role : localStorage.getItem('userRole')} /> {/* Passing userRole prop */}
            <div className="main-content">
              <Routes>
                <Route path="/company/add-employee" element={<EmployeeForm />} />
                <Route path="/company/upload" element={<FileUpload />} />
                <Route path="/company/search-employees" element={<EmployeeSearchForm />} />
                <Route path="/talent-verify/update-company" element={<TalentVerifyUpdateCompanyForm />} />
                <Route path="/talent-verify/bulk-update" element={<TalentVerifyBulkUpdateForm />} />
                <Route path="/talent-verify-dashboard" element={<TalentVerifyDashboard />} />
                <Route path="/company-user-dashboard" element={<CompanyUserDashboard />} />
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
    <h1 style={{
    textShadow: '2px 2px 5px rgba(0,0,0,0.3), 4px 4px 10px rgba(0,0,0,0.2), 6px 6px 15px rgba(0,0,0,0.1)',
    fontSize: '3em',
    color: '#2E8B57', // SeaGreen
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: "'Arial', sans-serif"
}}>
    Welcome to Talent Verify
</h1>

    <p>
      Talent Verify is an online talent verification service designed to streamline the process of verifying 
      employee information for companies. Our platform allows employers to provide comprehensive details 
      about their company and employees, ensuring accurate and up-to-date records.
    </p>

    <p>
      Our platform supports both bulk upload and single entries of all or part of employee or company 
      information. Keep track of employee history as they progress within the company or move to different 
      companies.
    </p>

  </div>
);

const AppContainer = () => (
  <AuthProvider> {/* Assuming AuthProvider wraps your App */}
    <App />
  </AuthProvider>
);

export default AppContainer;
