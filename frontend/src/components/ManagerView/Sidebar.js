// Sidebar.js
import React from 'react';

const Sidebar = ({ setPage }) => {
  return (
    <div className="sidebar">
      <button onClick={() => setPage('employees')}>Employee Information</button>
      <button onClick={() => setPage('inventory')}>Inventory Display</button>
      <button onClick={() => setPage('stats')}>POS Information</button>
    </div>
  );
};

export default Sidebar;