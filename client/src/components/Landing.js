import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', email, password);
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <h2>GYM APP</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'white', color: 'rgb(25, 25, 25)', marginBottom: '10px' }}>
          Login
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <Link to="/forgot-password" style={{ color: 'white', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
          <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Registrarme</Link>
        </div>
      </form>
    </div>
  );
};

export default Landing;