import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaUser, FaCalendarAlt } from 'react-icons/fa';

const TrainerNavBar = () => {
  const location = useLocation();

  return (
    <nav className="trainer-nav">
      <Link 
        to="/TrainerDashboard" 
        className={location.pathname === '/TrainerDashboard' ? 'active' : ''}
      >
        <FaHome />
        <span>Home</span>
      </Link>
      <Link 
        to="/TrainerDashboard/search" 
        className={location.pathname.includes('/search') ? 'active' : ''}
      >
        <FaSearch />
        <span>Search</span>
      </Link>
      <Link 
        to="/TrainerDashboard/schedule" 
        className={location.pathname.includes('/schedule') ? 'active' : ''}
      >
        <FaCalendarAlt />
        <span>Schedule</span>
      </Link>
      <Link 
        to="/TrainerDashboard/profile" 
        className={location.pathname.includes('/profile') ? 'active' : ''}
      >
        <FaUser />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default TrainerNavBar; 