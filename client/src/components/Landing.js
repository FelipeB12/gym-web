import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './img/logo.png';

const Landing = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5002/api/auth/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log('Login response:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        onLogin(
          response.data.user.name, 
          response.data.user.membership, 
          response.data.user.role,
          response.data.user.gymType
        );
        
        if (response.data.user.role === 'trainer') {
          navigate('/TrainerDashboard');
        } else if (response.data.user.role === 'admin') {
          navigate('/admin/home');
        } else {
          navigate('/ClientDashboard');
        }
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.msg);
      } else {
        setError('Invalid email or password');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="app-container"> {/* Centering container */}
      <div className="landing-form common-form">
        <img src={logo} alt="Logo" className="logo" />
        <form onSubmit={handleSubmit}>
          <h2 className="common-title">GYM APP</h2>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="common-input"
            autoComplete="username"
            id="email"
            name="email"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="common-input"
            autoComplete="current-password"
            id="password"
            name="password"
          />
          <button type="submit" className="common-button">
            Ingresar
          </button>
          {error && <p className="error-message">{error}</p>}
          <div className="link-container">
            <Link to="/forgot-password" className="link">¿Olvidaste tu contraseña?</Link>
            <Link to="/register" className="link">Registrarme</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Landing;
