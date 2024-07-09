import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false); // Close sidebar on route change
  }, [location]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-top">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <h3>{userRole === 'talent_verify' ? 'Talent Verify Dashboard' : 'Company User Dashboard'}</h3>
            </li>
            <li>
              <Link to="/company/add-employee">Add Employee</Link>
            </li>
            <li>
              <Link to="/company/upload">Upload Employee Data</Link>
            </li>
            <li>
              <Link to="/company/search-employees">Search Employees</Link>
            </li>
            {userRole === 'talent_verify' && (
              <>
                <li>
                  <Link to="/talent-verify/update-company">Update Company</Link>
                </li>
                <li>
                  <Link to="/talent-verify/bulk-update">Bulk Company Upload</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
