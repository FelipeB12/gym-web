import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [gymType, setGymType] = useState('test-gym');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [objective, setObjective] = useState('strength');
  const [medicalCondition, setMedicalCondition] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !age || !height || !weight) {
      setError('Por favor llena todos los campos');
      return;
    }
    setError('');
    try {
      await axios.post('http://localhost:5002/api/auth/register', {
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
      
      // Set success message
      setSuccessMessage('Usuario registrado correctamente');

      // Redirect to landing page after 2 seconds
      setTimeout(() => {
        navigate('/'); // Redirect to Landing page
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
        <form onSubmit={handleSubmit}>
          <h2 className="common-title">GYM APP</h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
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
          >
            <option value="prueba-gratis">Prueba Gratis</option>
            <option value="test-gym">Test Gym</option>  
          </select>

          <p className='title'>Información de progreso</p>
          
          <div className="gender-selection">
            <label className={`gender-button ${gender === 'male' ? 'active' : ''}`}>
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
                style={{ display: 'none' }}
              />
              Hombre
            </label>
            <label className={`gender-button ${gender === 'female' ? 'active' : ''}`}>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
