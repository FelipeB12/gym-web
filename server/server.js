const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Make sure this line is present
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/your_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));



// Middleware
app.use(express.json());

// Routes
// Add your routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
