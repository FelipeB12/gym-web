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
        <span>Inicio</span>
      </Link>
      <Link 
        to="/TrainerDashboard/search" 
        className={location.pathname.includes('/search') ? 'active' : ''}
      >
        <FaSearch />
        <span>Buscar</span>
      </Link>
      <Link 
        to="/TrainerDashboard/schedule" 
        className={location.pathname.includes('/schedule') ? 'active' : ''}
      >
        <FaCalendarAlt />
        <span>Agenda</span>
      </Link>
      <Link 
        to="/TrainerDashboard/profile" 
        className={location.pathname.includes('/profile') ? 'active' : ''}
      >
        <FaUser />
        <span>Perfil</span>
      </Link>
    </nav>
  );
};

export default TrainerNavBar; 