import React from 'react';
import logout from './logout';

const YourComponent = () => {
  const handleLogout = () => {
    logout();
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default YourComponent;
