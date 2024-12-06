import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClientProfile from './ClientProfile';
import ClientWorkouts from './ClientWorkouts';
import ClientAIChat from './ClientAIChat';
import ClientAppointment from './ClientAppointment';
import ClientProgress from './ClientProgress';

const ClientDashboard = ({ userName, membership, gymType }) => {
  const navigate = useNavigate();
  const [trainerName, setTrainerName] = useState('');
  
  useEffect(() => {
    const fetchTrainerName = async () => {
      console.log('Fetching trainer name for gymType:', gymType);
      try {
        const response = await axios.get(`http://localhost:5002/api/auth/trainer/${gymType}`);
        console.log('Trainer response:', response.data);
        setTrainerName(response.data.name);
      } catch (err) {
        console.error('Error fetching trainer name:', err);
      }
    };

    if (gymType) {
      fetchTrainerName();
    } else {
      console.log('No gymType provided');
    }
  }, [gymType]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="header">
          <div className="member-id">{trainerName}</div>
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
