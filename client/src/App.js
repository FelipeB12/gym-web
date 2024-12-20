import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import ClientDashboard from './components/ClientDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ClientProfile from './components/ClientProfile';
import ClientWorkouts from './components/ClientWorkouts';
import ClientEditWorkout from './components/ClientEditWorkout';
import ClientAIChat from './components/ClientAIChat';
import ClientProgress from './components/ClientProgress';
import ClientAppointment from './components/ClientAppointment';
import Layout from './components/Layout';
import TrainerEditClientProgress from './components/TrainerEditClientProgress';
import AdminDashboard from './components/AdminDashboard';
import RegisterTrainer from './components/RegisterTrainer';
import TrainerEditClientRoutine from './components/TrainerEditClientRoutine';
import './styles.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [membership, setMembership] = useState('');
  const [gymType, setGymType] = useState('');

  const handleLogin = (name, membership, role, gymType) => {
    console.log('User logged in:', name, 'Role:', role, 'GymType:', gymType);
    setIsAuthenticated(true);
    setUserName(name);
    setUserRole(role);
    setMembership(membership);
    setGymType(gymType);
  };

  return (
    <Router>
      <div className="title">
        {isAuthenticated && (
          <header className="app-header">
            <h1 className="app-title">GYM <br /> APP</h1>
            <p className="user-greeting">Hola {userName}</p>
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
                userRole === 'client' ? (
                  <Layout>
                    <ClientDashboard 
                      userName={userName} 
                      membership={membership}
                      gymType={gymType}
                    />
                  </Layout>
                ) : <Navigate to="/" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/ClientProfile"
            element={
              isAuthenticated ? (
                <Layout>
                  <ClientProfile />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/ClientWorkouts"
            element={
              isAuthenticated ? (
                <Layout>
                  <ClientWorkouts />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/ClientAIChat"
            element={
              isAuthenticated ? (
                <Layout>
                  <ClientAIChat />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/ClientProgress"
            element={
              isAuthenticated ? (
                <Layout>
                  <ClientProgress />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/ClientAppointment"
            element={
              isAuthenticated ? (
                <Layout>
                  <ClientAppointment />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/ClientEditWorkout"
            element={
              isAuthenticated ? (
                <Layout>
                  <ClientEditWorkout />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/TrainerDashboard/*"
            element={
              isAuthenticated ? (
                userRole === 'trainer' ? (
                  <Layout>
                    <TrainerDashboard />
                  </Layout>
                ) : <Navigate to="/" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/TrainerDashboard/edit-progress/:userId"
            element={
              isAuthenticated ? (
                userRole === 'trainer' ? (
                  <Layout>
                    <TrainerEditClientProgress />
                  </Layout>
                ) : <Navigate to="/" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/TrainerDashboard/edit-routine/:userId"
            element={
              isAuthenticated ? (
                userRole === 'trainer' ? (
                  <Layout>
                    <TrainerEditClientRoutine />
                  </Layout>
                ) : <Navigate to="/" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/*"
            element={
              isAuthenticated ? (
                userRole === 'admin' ? (
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                ) : <Navigate to="/" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/register-trainer" element={<RegisterTrainer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
