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
    medicalCondition: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          gym: response.data.gymType || 'test-gym',
          membership: response.data.membership?.toString() || '',
          gender: response.data.gender || '',
          age: response.data.age?.toString() || '',
          height: response.data.height?.toString() || '',
          weight: response.data.weight?.toString() || '',
          objective: response.data.objective || '',
          medicalCondition: response.data.medicalCondition || ''
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
    setFormData({ ...formData, [id]: value });
    validateInput(e.target);
  };

  const validateInput = (input) => {
    const { id, value } = input;
    let isValid = true;
    let errorMessage = '';

    switch (id) {
      case 'name':
        isValid = value.length >= 2;
        errorMessage = isValid ? '' : 'Please enter your name';
        break;
      case 'password':
        isValid = value.length >= 6;
        errorMessage = isValid ? '' : 'Password must be at least 6 characters';
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        errorMessage = isValid ? '' : 'Please enter a valid email';
        break;
      case 'gym':
        isValid = value.length >= 2;
        errorMessage = isValid ? '' : 'Please enter your gym name';
        break;
      case 'membership':
        isValid = value.length >= 2;
        errorMessage = isValid ? '' : 'Please enter your membership type';
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: errorMessage
    }));

    input.classList.toggle('error', !isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/update-profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Error updating profile' });
    }
  };

  return (
    <div className="container">
      <form className="common-form" id="profileForm" onSubmit={handleSubmit}>
        <h1 className="common-title">Profile</h1>
        
        {errors.fetch && <div className="error-message">{errors.fetch}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Edad:</label>
          <input
            type="text"
            id="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="height">Altura (cm):</label>
          <input
            type="text"
            id="height"
            placeholder="Height in cm"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Peso (kg):</label>
          <input
            type="text"
            id="weight"
            placeholder="Weight in kg"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="objective">Objetivo:</label>
          <input
            type="text"
            id="objective"
            placeholder="Your fitness objective"
            value={formData.objective}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="medicalCondition">Condición Médica:</label>
          <textarea
            id="medicalCondition"
            placeholder="Any medical conditions"
            value={formData.medicalCondition}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default ClientProfile;
