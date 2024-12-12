import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaDumbbell, FaRobot, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const ClientNavBar = () => {
  const location = useLocation();

  return (
    <nav className="client-nav">
      <Link 
        to="/clientdashboard" 
        className={location.pathname === '/clientdashboard' ? 'active' : ''}
      >
        <FaHome />
        <span>Inicio</span>
      </Link>
      <Link 
        to="clientworkouts" 
        className={location.pathname === '/clientworkouts' ? 'active' : ''}
      >
        <FaDumbbell />
        <span>Rutinas</span>
      </Link>
      <Link 
        to="clientprogress" 
        className={location.pathname === '/clientprogress' ? 'active' : ''}
      >
        <FaChartLine />
        <span>Progreso</span>
      </Link>
      <Link 
        to="clientaichat" 
        className={location.pathname === '/clientaichat' ? 'active' : ''}
      >
        <FaRobot />
        <span>Chat</span>
      </Link>
      <Link 
        to="clientprofile" 
        className={location.pathname === '/clientprofile' ? 'active' : ''}
      >
        <FaUser />
        <span>Perfil</span>
      </Link>
      <Link 
        to="clientappointment" 
        className={location.pathname === '/clientappointment' ? 'active' : ''}
      >
        <FaCalendarAlt />
        <span>Valoración</span>
      </Link>
    </nav>
  );
};

export default ClientNavBar; 