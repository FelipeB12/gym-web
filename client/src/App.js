import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import ClientDashboard from './components/ClientDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import './styles.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // You would typically decode the token here to get the user role
      setUserRole('client'); // or 'trainer' based on the user's role
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/ClientDashboard/*"
          element={
            isAuthenticated ? (
              userRole === 'client' ? <ClientDashboard /> : <Navigate to="/" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/TrainerDashboard/*"
          element={
            isAuthenticated ? (
              userRole === 'trainer' ? <TrainerDashboard /> : <Navigate to="/" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;