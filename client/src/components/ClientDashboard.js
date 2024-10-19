import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientProfile from './ClientProfile';
import ClientWorkouts from './ClientWorkouts';
import ClientAIChat from './ClientAIChat';
import ClientProgress from './ClientProgress';

const ClientDashboard = ({ userName }) => { // Receive userName as a prop

  // Function to handle circle click
  const handleCircleClick = (e) => {
    e.currentTarget.classList.toggle('active');
  };

  return (
    <React.Fragment>
      <div className="container">
        <div className="header">
          <div className="member-id">Trigs 9999999</div>
          <div className="days-left">Membership left: 69 days</div>
        </div>
        <div className="title">Asistencia Semanal</div>
        <div className="week-circles">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="circle" onClick={handleCircleClick}></div>
          ))}
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Calorias</span>
            <span className="stat-value">2000</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Proteina</span>
            <span className="stat-value">100</span>
          </div>
        </div>
        <button className="button">Empezar</button>
      </div>

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

      <Routes>
        <Route path="clientprofile" element={<ClientProfile />} />
        <Route path="clientworkouts" element={<ClientWorkouts />} />
        <Route path="clientiachat" element={<ClientAIChat />} />
        <Route path="clientprogress" element={<ClientProgress />} />
      </Routes>
    </React.Fragment>
  );
};

export default ClientDashboard;
