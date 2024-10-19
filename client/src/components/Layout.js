import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div>
      <nav className="bottom-nav">
        <Link to="/ClientDashboard" className="nav-icon">
          <span role="img" aria-label="Home">🏠</span> {/* Home Icon */}
        </Link>
        <Link to="/ClientWorkouts" className="nav-icon">
          <span role="img" aria-label="Workouts">🏋️‍♂️</span> {/* Workouts Icon */}
        </Link>
        <Link to="/ClientAIChat" className="nav-icon">
          <span role="img" aria-label="Nutrition">💬</span> {/* Nutrition Icon */}
        </Link>
        <Link to="/ClientProgress" className="nav-icon">
          <span role="img" aria-label="Progress">📈</span> {/* Progress Icon */}
        </Link>
        <Link to="/ClientProfile" className="nav-icon">
          <span role="img" aria-label="Profile">👤</span>  {/* Profile Icon */}
        </Link>
      </nav>
      {children} {/* Render the current view here */}
    </div>
  );
};

export default Layout;
