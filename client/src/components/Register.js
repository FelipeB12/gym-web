import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './img/logo.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gymType, setGymType] = useState('');
  const [activeTrainers, setActiveTrainers] = useState([]);
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [objective, setObjective] = useState('strength');
  const [medicalCondition, setMedicalCondition] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveTrainers = async () => {
      try {
        const response = await axios.get('https://gymapp.site/api/auth/active-trainers');
        setActiveTrainers(response.data);
        if (response.data.length > 0) {
          setGymType(response.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching active trainers:', err);
        setError('Error loading available gyms');
      }
    };

    fetchActiveTrainers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !age || !height || !weight) {
      setError('Por favor llena todos los campos');
      return;
    }
    setError('');
    try {
      await axios.post('https://gymapp.site/api/auth/register', {
        name,
        email,
        password,
        role: 'client',
        gymType,
        gender,
        age,
        height,
        weight,
        objective,
        medicalCondition
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      setSuccessMessage('Usuario registrado correctamente');

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg || error.response.data.error || 'An error occurred during registration');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="app-container">
      <div className="landing-form common-form">
        <img src={logo} alt="Logo" className="logo" />
        <form onSubmit={handleSubmit}>
          <h2 className="common-title">GYM APP</h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="common-input"
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="common-input"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="common-input"
            autoComplete="new-password"
          />
          <select
            value={gymType}
            onChange={(e) => setGymType(e.target.value)}
            className="common-select"
            required
          >
            <option value="">Selecciona un gimnasio</option>
            {activeTrainers.map(trainer => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.name}
              </option>
            ))}
          </select>

          <h3>Información de progreso</h3>
          
          <div className="gender-selection">
            <label className={`gender-option ${gender === 'male' ? 'active' : ''}`}>
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
                style={{ display: 'none' }}
              />
              Hombre
            </label>
            <label className={`gender-option ${gender === 'female' ? 'active' : ''}`}>
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
                style={{ display: 'none' }}
              />
              Mujer
            </label>
          </div>

          <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="common-input"
            autoComplete="age"
          />
          <input
            type="number"
            placeholder="Altura (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="common-input"
            autoComplete="height"
          />
          <input
            type="number"
            placeholder="Peso (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="common-input"
            autoComplete="weight"
          />
          <select
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="common-select"
          >
            <option value="strength">Ganar fuerza</option>
            <option value="lose-weight">Perder peso</option>
            <option value="gain-weight">Ganar peso</option>
          </select>

          <textarea
            placeholder="Condición médica especial, si no aplica escriba: ninguna"
            value={medicalCondition}
            onChange={(e) => setMedicalCondition(e.target.value)}
            className="common-input"
            rows="3"
          />

          <button type="submit" className="common-button">
            Registrarme
          </button>
          <div className="link-container">
            <Link to="/" className="link">¿Ya tienes una cuenta? Inicia sesión</Link>
            <Link to="/register-trainer" className="link">Registrarme como GYM</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
