import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientProfile from './ClientProfile';
import ClientWorkouts from './ClientWorkouts';
import ClientAIChat from './ClientAIChat';
import ClientProgress from './ClientProgress';

const ClientDashboard = () => {
  // Function to handle circle click
  const handleCircleClick = (e) => {
    e.currentTarget.classList.toggle('active');
  };

  // Function to handle button click
  const handleButtonClick = () => {
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
        <button className="button" onClick={handleButtonClick}>Empezar</button>
      </div>

      <div>
        <Routes>
          <Route path="clientprofile" element={<ClientProfile />} />
          <Route path="clientworkouts" element={<ClientWorkouts />} />
          <Route path="clientiachat" element={<ClientAIChat />} />
          <Route path="clientprogress" element={<ClientProgress />} />
          <Route path="/" element={<ClientProfile />} />
        </Routes>
        <nav className="bottom-nav">
          <Link to="clientdashboard" className="nav-icon">🏠</Link> {/* Home Icon */}
          <Link to="clientworkouts" className="nav-icon">🏋️‍♂️</Link> {/* Workouts Icon */}
          <Link to="clientiachat" className="nav-icon">💬</Link> {/* Nutrition Icon */}
          <Link to="clientprogress" className="nav-icon">📈</Link> {/* Progress Icon */}
          <Link to="clientprofile" className="nav-icon">👤</Link>  {/* Settings Icon */}
        </nav>
      </div>
    </React.Fragment>
  );
};




export default ClientDashboard;
