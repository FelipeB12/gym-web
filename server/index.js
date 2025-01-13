const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Environment variables with defaults
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym_app';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve the CSS file
app.get('/src/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src/styles.css'));
});

// Make environment variables available to routes
app.use((req, res, next) => {
  req.app.locals.JWT_SECRET = JWT_SECRET;
  next();
});

// Routes
const workoutRoutes = require('./routes/workouts');
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
