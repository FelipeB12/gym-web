import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TrainerNavBar from './TrainerNavBar';
import TrainerHome from './TrainerHome';
import TrainerHeatmap from './TrainerHeatmap';
import TrainerSearch from './TrainerSearch';
import TrainerProfile from './TrainerProfile';
import TrainerEditClientRoutine from './TrainerEditClientRoutine';

const TrainerDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<TrainerHome />} />
          <Route path="/heatmap" element={<TrainerHeatmap />} />
          <Route path="/search" element={<TrainerSearch />} />
          <Route path="/profile" element={<TrainerProfile />} />
          <Route path="/edit-routine/:userId" element={<TrainerEditClientRoutine />} />
        </Routes>
      </div>
      <TrainerNavBar />
    </div>
  );
};

export default TrainerDashboard;