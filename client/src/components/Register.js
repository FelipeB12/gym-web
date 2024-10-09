import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    try {
      console.log('Attempting to register...');
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role: 'client'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('Registration response:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        setError(error.response.data.msg || error.response.data.error || 'An error occurred during registration');
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received from the server. Please try again.');
      } else {
        console.error('Error message:', error.message);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <h2>GYM APP - Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          autoComplete="new-password"
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'white', color: 'rgb(25, 25, 25)', marginBottom: '10px' }}>
          Registrarme
        </button>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>¿Ya tienes una cuenta? Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;