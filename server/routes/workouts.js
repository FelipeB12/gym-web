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

module.exports = router; 