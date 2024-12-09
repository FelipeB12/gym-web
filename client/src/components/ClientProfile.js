import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gym: 'test-gym',
    membership: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    objective: '',
    medicalCondition: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5002/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setFormData({
          name: data.name || '',
          email: data.email || '',
          gym: data.gymType || 'test-gym',
          membership: data.membership?.toString() || '',
          gender: data.gender || '',
          age: data.age?.toString() || '',
          height: data.height?.toString() || '',
          weight: data.weight?.toString() || '',
          objective: data.objective || '',
          medicalCondition: data.medicalCondition || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrors({ fetch: 'Error loading user data' });
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [id]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'El nombre es requerido (mínimo 2 caracteres)';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.age || isNaN(formData.age)) {
      newErrors.age = 'La edad debe ser un número';
    }
    
    if (!formData.height || isNaN(formData.height)) {
      newErrors.height = 'La altura debe ser un número';
    }
    
    if (!formData.weight || isNaN(formData.weight)) {
      newErrors.weight = 'El peso debe ser un número';
    }

    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'La contraseña actual es requerida';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'La nueva contraseña es requerida';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        email: formData.email,
        gymType: formData.gym,
        gender: formData.gender,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        objective: formData.objective,
        medicalCondition: formData.medicalCondition
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
        updateData.confirmPassword = formData.confirmPassword;
      }

      await axios.put(
        'http://localhost:5002/api/auth/user',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setSuccessMessage('Información actualizada');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ 
        submit: error.response?.data?.msg || 'Error al actualizar el perfil'
      });
    }
  };

  return (
    <div className="container">
      <form className="common-form" onSubmit={handleSubmit}>
        <h1 className="common-title">Mi Perfil</h1>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Edad:</label>
          <input
            type="number"
            id="age"
            value={formData.age}
            onChange={handleChange}
            className={errors.age ? 'error' : ''}
          />
          {errors.age && <div className="error-message">{errors.age}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="height">Altura (cm):</label>
          <input
            type="number"
            id="height"
            placeholder="Altura en cm"
            value={formData.height}
            onChange={handleChange}
            className={errors.height ? 'error' : ''}
          />
          {errors.height && <div className="error-message">{errors.height}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="weight">Peso (kg):</label>
          <input
            type="number"
            id="weight"
            placeholder="Peso en kg"
            value={formData.weight}
            onChange={handleChange}
            className={errors.weight ? 'error' : ''}
          />
          {errors.weight && <div className="error-message">{errors.weight}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="objective">Objetivo:</label>
          <select
            id="objective"
            placeholder="Tu objetivo de entrenamiento"
            value={formData.objective}
            onChange={handleChange}
          >
            <option value="strength">Ganar fuerza</option>
            <option value="lose-weight">Perder peso</option>
            <option value="gain-weight">Ganar peso</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="medicalCondition">Condición Médica:</label>
          <textarea
            id="medicalCondition"
            placeholder="Que deban ser tomadas en cuanta para tu entrenamiento, como enfermedades cardiacas..."
            value={formData.medicalCondition}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentPassword">Contraseña Actual:</label>
          <input
            type="password"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={errors.currentPassword ? 'error' : ''}
          />
          {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña:</label>
          <input
            type="password"
            id="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={errors.newPassword ? 'error' : ''}
          />
          {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>

        <button 
          type="submit" 
          className="submit-button"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default ClientProfile;
