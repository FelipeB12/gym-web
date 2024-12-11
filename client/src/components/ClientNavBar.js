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
        <span>Inicio</span>
      </Link>
      <Link 
        to="/ClientWorkouts" 
        className={location.pathname === '/ClientWorkouts' ? 'active' : ''}
      >
        <FaDumbbell />
        <span>Rutinas</span>
      </Link>
      <Link 
        to="/ClientProgress" 
        className={location.pathname === '/ClientProgress' ? 'active' : ''}
      >
        <FaChartLine />
        <span>Progreso</span>
      </Link>
      <Link 
        to="/ClientAIChat" 
        className={location.pathname === '/ClientAIChat' ? 'active' : ''}
      >
        <FaRobot />
        <span>Chat</span>
      </Link>
      <Link 
        to="/ClientProfile" 
        className={location.pathname === '/ClientProfile' ? 'active' : ''}
      >
        <FaUser />
        <span>Perfil</span>
      </Link>
      <Link 
        to="/ClientAppointment" 
        className={location.pathname === '/ClientAppointment' ? 'active' : ''}
      >
        <FaCalendarAlt />
        <span>Valoración</span>
      </Link>
    </nav>
  );
};

export default ClientNavBar; 