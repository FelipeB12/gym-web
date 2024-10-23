const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Ensure this is required
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'client', 'trainer'],
    default: 'client'
  },
  membership: {
    type: Number,
    default: 0 // Default value for membership
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true // Ensure this is required
  },
  age: {
    type: Number,
    required: true // Ensure this is required
  },
  height: {
    type: Number,
    required: true // Ensure this is required
  },
  weight: {
    type: Number,
    required: true // Ensure this is required
  },
  objective: {
    type: String,
    enum: ['strength', 'lose-weight', 'gain-weight'],
    required: true // Ensure this is required
  },
  medicalCondition: {
    type: String,
    default: '' // Default value for medical condition
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
