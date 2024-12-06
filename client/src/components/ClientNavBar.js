import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaDumbbell, FaRobot, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const ClientNavBar = () => {
  const location = useLocation();

  return (
    <nav className="client-nav">
      <Link 
        to="/ClientDashboard" 
        className={location.pathname === '/ClientDashboard' ? 'active' : ''}
      >
        <FaHome />
        <span>Home</span>
      </Link>
      <Link 
        to="/ClientProfile" 
        className={location.pathname === '/ClientProfile' ? 'active' : ''}
      >
        <FaUser />
        <span>Profile</span>
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
        <FaRobot />
        <span>AI Chat</span>
      </Link>
      <Link 
        to="/ClientProgress" 
        className={location.pathname === '/ClientProgress' ? 'active' : ''}
      >
        <FaChartLine />
        <span>Progress</span>
      </Link>
      <Link 
        to="/ClientAppointment" 
        className={location.pathname === '/ClientAppointment' ? 'active' : ''}
      >
        <FaCalendarAlt />
        <span>Appointment</span>
      </Link>
    </nav>
  );
};

export default ClientNavBar; 