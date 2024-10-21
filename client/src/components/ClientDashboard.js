import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientProfile from './ClientProfile';
import ClientWorkouts from './ClientWorkouts';
import ClientAIChat from './ClientAIChat';
import ClientAppointment from './ClientAppointment';
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

      <Routes>
        <Route path="clientprofile" element={<ClientProfile />} />
        <Route path="clientworkouts" element={<ClientWorkouts />} />
        <Route path="clientaichat" element={<ClientAIChat />} />
        <Route path="clientprogress" element={<ClientProgress />} />
        <Route path="clientappointment" element={<ClientAppointment />} />
      </Routes>
    </React.Fragment>
  );
};

export default ClientDashboard;
