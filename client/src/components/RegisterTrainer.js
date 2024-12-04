import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterTrainer = () => {
  const [gymName, setGymName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [estimatedUsers, setEstimatedUsers] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gymName || !email || !password || !confirmPassword || !estimatedUsers) {
      setError('Por favor llena todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');
    try {
      const response = await axios.post('http://localhost:5002/api/auth/register-trainer', {
        gymName,
        email,
        password,
        estimatedUsers
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Registration response:', response.data);
      setSuccessMessage('Entrenador registrado correctamente');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.msg || 
        'Error en el registro. Por favor intente nuevamente.'
      );
    }
  };

  return (
    <div className="app-container">
      <div className="landing-form common-form">
        <form onSubmit={handleSubmit}>
          <h2 className="common-title">Registrar Entrenador</h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <input
            type="text"
            placeholder="Nombre del GYM"
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            className="common-input"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="common-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="common-input"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="common-input"
          />
          <input
            type="number"
            placeholder="Cantidad estimada de usuarios"
            value={estimatedUsers}
            onChange={(e) => setEstimatedUsers(e.target.value)}
            className="common-input"
          />
          <button type="submit" className="common-button">
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTrainer; 