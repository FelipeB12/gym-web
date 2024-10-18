import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Landing = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log('Login response:', response.data); // Log the entire response


      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.name); // This should be the user's name
        navigate('/ClientDashboard');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="landing-form">
      <form onSubmit={handleSubmit}>
        <h2 className="title">GYM APP</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          autoComplete="current-password"
        />
        <button type="submit">
          Ingresar
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <Link to="/forgot-password" style={{ color: 'white', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
          <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Registrarme</Link>
        </div>
      </form>
    </div>
  );
};

export default Landing;
