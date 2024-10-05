const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'trainer'],
    required: true,
  },
  // Add more fields as needed
});

module.exports = mongoose.model('User', UserSchema);