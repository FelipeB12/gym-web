import React from 'react';
import ClientNavBar from './ClientNavBar';
import TrainerNavBar from './TrainerNavBar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Determine which navbar to show based on the current path
  const isTrainerPath = location.pathname.startsWith('/TrainerDashboard');
  const isClientPath = location.pathname.startsWith('/Client');

  return (
    <div>
      {isTrainerPath && <TrainerNavBar />}
      {isClientPath && <ClientNavBar />}
      {children}
    </div>
  );
};

export default Layout;
