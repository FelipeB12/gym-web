import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientProfile from './ClientProfile';
import ClientWorkouts from './ClientWorkouts';
import ClientNutrition from './ClientNutrition';
import ClientProgress from './ClientProgress';

const ClientDashboard = () => {
  return (
    <div>
       <nav>
         <Link to="ClientProfile">Profile</Link>
         <Link to="ClientWorkouts">Workouts</Link>
         <Link to="ClientNutrition">Nutrition</Link>
         <Link to="ClientProgress">Progress</Link>
       </nav>
      <Routes>
        <Route path="clientprofile" element={<ClientProfile />} />
        <Route path="clientworkouts" element={<ClientWorkouts />} />
        <Route path="clientnutrition" element={<ClientNutrition />} />
        <Route path="clientprogress" element={<ClientProgress />} />
        <Route path="/" element={<ClientProfile />} />
      </Routes>
    </div>
  );
};

// ... other component definitions ...

export default ClientDashboard;