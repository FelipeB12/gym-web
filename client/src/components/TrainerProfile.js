import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [clientCount, setClientCount] = useState(0);
  const [estimatedUsers, setEstimatedUsers] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5002/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Fetch client count for this trainer
        const clientsResponse = await axios.get('http://localhost:5002/api/auth/trainer-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setClientCount(clientsResponse.data.clientCount);
        setEstimatedUsers(data.estimatedUsers || 0);
        
        setFormData(prevState => ({
          ...prevState,
          name: data.name || '',
          email: data.email || ''
        }));
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        setErrors({ fetch: 'Error loading trainer data' });
      }
    };

    fetchTrainerData();
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
      newErrors.name = 'Name is required (minimum 2 characters)';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'La contraseña actual es requerida para cambiar la contraseña';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
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
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
        updateData.confirmPassword = formData.confirmPassword;
      }

      const response = await axios.put(
        'https://gymapp.site/api/auth/profile',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.msg === 'Profile updated successfully') {
        setSuccessMessage('Profile updated successfully!');
        setFormData(prevState => ({
          ...prevState,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ 
        submit: error.response?.data?.msg || 'Error updating profile'
      });
    }
  };

  return (
    <div className="container">
      <div className="stats-container">
        <div className="stats-box">
          <h3>Usuarios Actuales</h3>
          <p className="stats-number">{clientCount}</p>
        </div>
        <div className="stats-box">
          <h3>Usuarios Estimados</h3>
          <p className="stats-number">{estimatedUsers}</p>
        </div>
      </div>

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
            disabled
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            disabled
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="currentPassword">Contraseña actual:</label>
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
          <label htmlFor="newPassword">Nueva contraseña:</label>
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
          <label htmlFor="confirmPassword">Confirmar nueva contraseña:</label>
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
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default TrainerProfile;