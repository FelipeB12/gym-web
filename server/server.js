// Importing required modules
const express = require('express'); // Express is a web framework for Node.js, used to handle HTTP requests and routing
const mongoose = require('mongoose'); // Mongoose is an ODM (Object Data Modeling) library to interact with MongoDB
const cors = require('cors'); // CORS (Cross-Origin Resource Sharing) middleware to allow requests from different origins
const authRoutes = require('./routes/auth'); // Routes related to authentication
const clientRoutes = require('./routes/clients'); // Routes related to gym clients
const trainerRoutes = require('./routes/trainers'); // Routes related to gym trainers

const app = express(); // Initializing the Express app

// Middleware
app.use(cors()); // Enables CORS for all routes to handle requests from different domains
app.use(express.json()); // Middleware to parse incoming JSON requests (converts JSON payload into JavaScript objects)

// Connecting to MongoDB
mongoose.connect('mongodb://localhost/gym_app', {
  useNewUrlParser: true, // Ensures the new MongoDB URL parser is used
  useUnifiedTopology: true, // Removes connection deprecation warnings by using MongoDB's new unified topology engine
  useCreateIndex: true, // Ensures that indexes are created using Mongoose's createIndex() function instead of MongoDB's deprecated ensureIndex()
})
.then(() => console.log('Connected to MongoDB')) // Logs a success message if the connection to the database is successful
.catch((err) => console.error('Failed to connect to MongoDB', err)); // Logs an error if the connection fails

// Setting up routes
app.use('/api/auth', authRoutes); // All requests to /api/auth are routed to the authRoutes module
app.use('/api/clients', clientRoutes); // All requests to /api/clients are routed to the clientRoutes module
app.use('/api/trainers', trainerRoutes); // All requests to /api/trainers are routed to the trainerRoutes module

// Define the port where the server will listen for requests
const PORT = process.env.PORT || 5000; // Use the port defined in the environment variables, or fallback to 5000 if undefined
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Starts the server and listens on the specified port

// Error handling middleware
app.use((err, req, res, next) => { // Middleware to handle errors in the application
  console.error(err.stack); // Logs the error stack trace to the console
  res.status(500).send('Something went wrong!'); // Sends a 500 response to the client indicating an internal server error
});

// Export the app object to be used in other files (e.g., for testing)
module.exports = app;
