const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateUserProfile } = require('../controllers/userController');

// Remove the duplicate route and keep only one correct version
router.put('/profile', protect, updateUserProfile);

module.exports = router; 