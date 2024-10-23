import React, { useState } from 'react';

const ClientProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    gym: '',
    membership: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    let isFormValid = true;

    Object.keys(formData).forEach((key) => {
      const input = document.getElementById(key);
      if (!validateInput(input)) {
        isFormValid = false;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: 'This field is required'
        }));
      }
    });

    if (isFormValid) {
      // Submit form data
      console.log('Form submitted:', formData);
      alert('Profile saved successfully!');
      setFormData({
        name: '',
        password: '',
        email: '',
        gym: '',
        membership: ''
      });
    }
  };

  // Define a unique identifier for the email input
  const uniqueIdentifier = 'client-profile'; // You can change this to something more dynamic if needed

  return (
    <div className="container">
      <form className="common-form" id="profileForm" onSubmit={handleSubmit}>
        <h1 className="common-title">Profile</h1>
        <div className="form-group">
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
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        
        <div className="form-group">
          <input
            type="email"
            id={`email-${uniqueIdentifier}`} // Use the unique identifier here
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <input
            type="text"
            id="gym"
            placeholder="Gym"
            value={formData.gym}
            onChange={handleChange}
            required
          />
          {errors.gym && <div className="error-message">{errors.gym}</div>}
        </div>
        
        <div className="form-group">
          <input
            type="text"
            id="membership"
            placeholder="Membership"
            value={formData.membership}
            onChange={handleChange}
            required
          />
          {errors.membership && <div className="error-message">{errors.membership}</div>}
        </div>
        
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ClientProfile;
