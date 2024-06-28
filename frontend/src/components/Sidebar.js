import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <nav className="sidebar-nav">
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
              <Link to="/talent-verify/bulk-update">Upload Company Data</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
