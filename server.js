const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const port = 5000; // Changed to 5000 as per your error message


// Enable CORS for all routes
app.use(cors()); 

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gym_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello from the Gym Web Server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});