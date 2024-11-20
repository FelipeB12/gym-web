import React from 'react';
import { Link } from 'react-router-dom';

const TrainerNavBar = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/TrainerDashboard" className="nav-icon">
        <span role="img" aria-label="Home">🏠</span>
      </Link>
      <Link to="/TrainerDashboard/heatmap" className="nav-icon">
        <span role="img" aria-label="Heatmap">📊</span>
      </Link>
      <Link to="/TrainerDashboard/search" className="nav-icon">
        <span role="img" aria-label="Search">🔍</span>
      </Link>
      <Link to="/TrainerDashboard/profile" className="nav-icon">
        <span role="img" aria-label="Profile">👤</span>
      </Link>
    </nav>
  );
};

export default TrainerNavBar; 