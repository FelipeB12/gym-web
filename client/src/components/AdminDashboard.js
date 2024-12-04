import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';  // Import icons
import { Link, useLocation } from 'react-router-dom';
import AdminHome from './AdminHome';
import AdminSearch from './AdminSearch';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Routes>
          <Route path="/home" element={<AdminHome />} />
          <Route path="/search" element={<AdminSearch />} />
        </Routes>
      </div>
      <nav className="trainer-nav">
        <Link 
          to="/admin/home" 
          className={location.pathname === '/admin/home' ? 'active' : ''}
        >
          <FaHome />
          <span>Home</span>
        </Link>
        <Link 
          to="/admin/search" 
          className={location.pathname === '/admin/search' ? 'active' : ''}
        >
          <FaSearch />
          <span>Search</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminDashboard; 