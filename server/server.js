const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Make sure this path is correct
const app = express();

// Add this near the top of the file, after your imports
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

mongoose.connect('mongodb://localhost:27017/gym_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/gym_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err.message));


// Add this just before your routes
console.log('Available routes:');
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
});
// Add this before your routes
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});