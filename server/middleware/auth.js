const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Auth middleware - Request URL:', req.originalUrl);
  console.log('Auth middleware - Method:', req.method);
  console.log('Incoming request to:', req.method, req.originalUrl); // Add this debug log
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  console.log('Auth middleware - Token:', token ? 'Present' : 'Missing'); // Debug log

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded.user;
    console.log('Auth middleware - User:', req.user); // Debug log
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
