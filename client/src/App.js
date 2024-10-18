import React, { useState } from 'react';
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
  const [userName, setUserName] = useState(''); // State for user's name

  const handleLogin = (name) => {
    console.log('User logged in:', name); // Debug log
    setIsAuthenticated(true); // Set to true only on successful login
    setUserName(name); // Set the user's name
    setUserRole('client'); // Set user role as needed
  };



  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && ( // Conditionally render the header
          <header className="app-header">
            <h1 className="app-title">GYM <br /> APP</h1>
            <p className="user-greeting">Hola {userName}</p> {/* This should display the user's name */}
          </header>
        )}
        <Routes>
          <Route path="/" element={<Landing onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/ClientDashboard/*"
            element={
              isAuthenticated ? (
                userRole === 'client' ? <ClientDashboard userName={userName} /> : <Navigate to="/" replace />
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
      </div>
    </Router>
  );
};

export default App;
