const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const userResponse = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      gymType: user.gymType,
      membership: user.membership
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: userResponse });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user data
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all clients (for trainers)
router.get('/clients', auth, async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password');
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, gymType, gender, age, height, weight, objective, medicalCondition } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: 'client',
      gymType,
      gender,
      age,
      height,
      weight,
      objective,
      medicalCondition
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Register trainer route
router.post('/register-trainer', async (req, res) => {
  try {
    const { gymName, email, password, estimatedUsers } = req.body;

    // Check if trainer exists
    let trainer = await User.findOne({ email });
    if (trainer) {
      return res.status(400).json({ msg: 'Trainer already exists' });
    }

    // Create new trainer
    trainer = new User({
      name: gymName,
      email,
      password,
      role: 'trainer',
      estimatedUsers
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    trainer.password = await bcrypt.hash(password, salt);

    await trainer.save();

    // Create and return JWT
    const payload = {
      user: {
        id: trainer.id,
        role: trainer.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get appointments for logged-in user
router.get('/appointments', auth, async (req, res) => {
  try {
    console.log('GET /appointments - User ID:', req.user.id);
    
    const appointments = await Appointment.find({ userId: req.user.id });
    console.log('Found appointments:', appointments);
    
    res.json({ appointments });
  } catch (err) {
    console.error('Error in GET /appointments:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Create new appointment
router.post('/appointments', auth, async (req, res) => {
  try {
    console.log('POST /appointments - Request body:', req.body);
    const { date, time } = req.body;
    
    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
      return res.status(400).json({ msg: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      userId: req.user.id,
      date,
      time,
      status: 'pending'
    });

    await appointment.save();
    console.log('Created appointment:', appointment);
    
    res.json({ appointment });
  } catch (err) {
    console.error('Error in POST /appointments:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Delete appointment
router.delete('/appointments/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete appointment:', req.params.id);
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      console.log('Appointment not found');
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check if the appointment belongs to the user
    if (appointment.userId.toString() !== req.user.id) {
      console.log('User not authorized to delete this appointment');
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Use findByIdAndDelete instead of remove()
    await Appointment.findByIdAndDelete(req.params.id);
    console.log('Appointment deleted successfully');
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Get all appointments (for trainers)
router.get('/trainer/appointments', auth, async (req, res) => {
    try {
        // Verify that the user is a trainer
        const trainer = await User.findById(req.user.id);
        if (trainer.role !== 'trainer') {
            return res.status(403).json({ msg: 'Not authorized as trainer' });
        }

        // Get all appointments and populate with user information
        const appointments = await Appointment.find()
            .populate('userId', 'name email')
            .sort({ date: 1, time: 1 });

        // Transform the data to include userName
        const formattedAppointments = appointments.map(apt => ({
            _id: apt._id,
            date: apt.date,
            time: apt.time,
            status: apt.status,
            userName: apt.userId.name,
            userEmail: apt.userId.email
        }));

        res.json({ appointments: formattedAppointments });
    } catch (err) {
        console.error('Error in GET /trainer/appointments:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Update appointment status (for trainers)
router.put('/trainer/appointments/:id', auth, async (req, res) => {
    try {
        // Verify that the user is a trainer
        const trainer = await User.findById(req.user.id);
        if (trainer.role !== 'trainer') {
            return res.status(403).json({ msg: 'Not authorized as trainer' });
        }

        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ appointment });
    } catch (err) {
        console.error('Error in PUT /trainer/appointments:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
