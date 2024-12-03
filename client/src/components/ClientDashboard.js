import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ClientProfile from './ClientProfile';
import ClientWorkouts from './ClientWorkouts';
import ClientAIChat from './ClientAIChat';
import ClientAppointment from './ClientAppointment';
import ClientProgress from './ClientProgress';

const ClientDashboard = ({ userName, membership, gymType }) => {
  const navigate = useNavigate();
  
  const handleCircleClick = (e) => {
    e.currentTarget.classList.toggle('active');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="header">
          <div className="member-id">{gymType || 'GYM-NAME'}</div>
          <div className="days-left">Días de membresía: {membership} days</div>
        </div>

        
        <button className="button" onClick={() => navigate('/clientworkouts')}>
          Empezar
        </button>
      </div>

      <Routes>
        <Route path="clientprofile" element={<ClientProfile />} />
        <Route path="clientworkouts" element={<ClientWorkouts />} />
        <Route path="clientaichat" element={<ClientAIChat />} />
        <Route path="clientprogress" element={<ClientProgress />} />
        <Route path="clientappointment" element={<ClientAppointment />} />
      </Routes>
    </div>
  );
};

export default ClientDashboard;
