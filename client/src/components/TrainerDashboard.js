import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TrainerProfile from './TrainerProfile';
import TrainerClients from './TrainerClients';
import TrainerSchedule from './TrainerSchedule';
import TrainerWorkouts from './TrainerWorkouts';

const TrainerDashboard = () => {
  return (
    <div>
       <nav>
         <Link to="TrainerDashboard">Profile</Link>
         <Link to="TrainerClients">Clients</Link>
         <Link to="TrainerSchedule">Schedule</Link>
         <Link to="TrainerWorkouts">Workouts</Link>
      </nav>
      <Routes>
        <Route path="TrainerDashboard" element={<TrainerDashboard />} />
        <Route path="TrainerClients" element={<TrainerClients />} />
        <Route path="TrainerSchedule" element={<TrainerSchedule />} />
        <Route path="TrainerWorkouts" element={<TrainerWorkouts />} />
        <Route path="/" element={<TrainerDashboard />} />
      </Routes>
    </div>
  );
};

// ... other component definitions ...

export default TrainerDashboard;