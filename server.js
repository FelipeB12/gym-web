const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();

// ... other middleware

// Mount the routes with the /api/users prefix
app.use('/api/users', userRoutes);

// ... rest of your server code 