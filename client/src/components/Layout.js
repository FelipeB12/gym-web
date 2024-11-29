import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaDumbbell, FaComments, FaChartLine, FaUser, FaCalendarAlt } from 'react-icons/fa';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div>
      <nav className="trainer-nav">
        <Link 
          to="/ClientDashboard" 
          className={location.pathname === '/ClientDashboard' ? 'active' : ''}
        >
          <FaHome />
          <span>Home</span>
        </Link>
        <Link 
          to="/ClientWorkouts" 
          className={location.pathname === '/ClientWorkouts' ? 'active' : ''}
        >
          <FaDumbbell />
          <span>Workouts</span>
        </Link>
        <Link 
          to="/ClientAIChat" 
          className={location.pathname === '/ClientAIChat' ? 'active' : ''}
        >
          <FaComments />
          <span>Chat</span>
        </Link>
        <Link 
          to="/ClientProgress" 
          className={location.pathname === '/ClientProgress' ? 'active' : ''}
        >
          <FaChartLine />
          <span>Progress</span>
        </Link>
        <Link 
          to="/ClientProfile" 
          className={location.pathname === '/ClientProfile' ? 'active' : ''}
        >
          <FaUser />
          <span>Profile</span>
        </Link>
        <Link 
          to="/ClientAppointment" 
          className={location.pathname === '/ClientAppointment' ? 'active' : ''}
        >
          <FaCalendarAlt />
          <span>Schedule</span>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
