const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET api/workouts
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Get the latest routine or create a new one
        let currentRoutine = user.routine && user.routine.length > 0 
            ? user.routine[0].values 
            : {
                "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
              };

        res.json({ routine: currentRoutine });
    } catch (err) {
        console.error('Error in GET /api/workouts:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// POST api/workouts
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const dayNumber = Object.keys(req.body)[0];
        const dayData = req.body[dayNumber];

        // Initialize routine if it doesn't exist
        if (!user.routine || !user.routine.length) {
            user.routine = [{
                date: new Date().toLocaleDateString('es-ES'),
                values: {
                    "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
                }
            }];
        }

        // Update the specific day's exercises
        user.routine[0].values[dayNumber] = dayData.exercises;
        user.routine[0].date = new Date().toLocaleDateString('es-ES');

        await user.save();
        res.json({ 
            msg: 'Rutina actualizada', 
            routine: user.routine[0].values 
        });
    } catch (err) {
        console.error('Error in POST /api/workouts:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// GET client routine (trainer only)
router.get('/client/:userId', auth, async (req, res) => {
  console.log('Received request for user ID:', req.params.userId);
  try {
    // Verify the requesting user is a trainer
    const requestingUser = await User.findById(req.user.id);
    console.log('Requesting user:', requestingUser?.role);
    if (!requestingUser || requestingUser.role !== 'trainer') {
      return res.status(403).json({ msg: 'Not authorized to view client routines' });
    }

    // Find the client
    const client = await User.findById(req.params.userId);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    // Get the routine or return empty structure
    const routine = client.routine && client.routine.length > 0 
      ? client.routine[0].values 
      : {
          "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
        };

    res.json({ routine });
  } catch (err) {
    console.error('Error fetching client routine:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST endpoint to update client routine
router.post('/client/:userId', auth, async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.id);
    if (!requestingUser || requestingUser.role !== 'trainer') {
      return res.status(403).json({ msg: 'Not authorized to modify client routines' });
    }

    const client = await User.findById(req.params.userId);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    const { day, exercises } = req.body;

    // Initialize routine if it doesn't exist
    if (!client.routine || !client.routine.length) {
      client.routine = [{
        date: new Date().toLocaleDateString('es-ES'),
        values: {
          "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
        }
      }];
    }

    // Update the specific day's exercises
    client.routine[0].values[day] = exercises;
    client.routine[0].date = new Date().toLocaleDateString('es-ES');

    await client.save();
    
    res.json({ 
      msg: 'Routine updated successfully',
      routine: client.routine[0].values 
    });
  } catch (err) {
    console.error('Error saving client routine:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 