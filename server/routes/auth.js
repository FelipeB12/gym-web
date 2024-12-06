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

    // Check if trainer is inactive
    if (user.role === 'trainer' && user.status === 'inactive') {
      return res.status(403).json({ 
        msg: 'El usuario se encuentra inactivo, por favor contactar support@gymapp.com'
      });
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

    // Create new trainer with only required fields
    trainer = new User({
      name: gymName,
      email,
      password,
      role: 'trainer',
      estimatedUsers,
      // Set default values for client-required fields
      gender: 'not_applicable',
      age: 0,
      height: 0,
      weight: 0,
      objective: 'not_applicable'
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
    console.error('Registration error:', err.message);
    res.status(500).json({ error: err.message });
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

// Get specific client by ID (for trainers)
router.get('/clients/:userId', auth, async (req, res) => {
  try {
    // Verify that the requesting user is a trainer
    const trainer = await User.findById(req.user.id);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(403).json({ msg: 'Not authorized to view client data' });
    }

    const client = await User.findById(req.params.userId).select('-password');
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    res.json(client);
  } catch (err) {
    console.error('Error in GET /clients/:userId:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Get client measurements
router.get('/clients/:userId/measurements', auth, async (req, res) => {
  console.log('Accessing measurements route with userId:', req.params.userId);
  try {
    // Verify trainer authorization
    const trainer = await User.findById(req.user.id);
    console.log('Trainer data:', trainer);
    
    if (!trainer || trainer.role !== 'trainer') {
      console.log('Authorization failed - Not a trainer');
      return res.status(403).json({ msg: 'Not authorized to view client measurements' });
    }

    // Find client
    console.log('Looking for client with ID:', req.params.userId);
    const client = await User.findById(req.params.userId);
    
    if (!client) {
      console.log('Client not found in database');
      return res.status(404).json({ msg: 'Client not found' });
    }
    
    console.log('Client found:', client.name);
    console.log('Client measurements:', client.measurements);

    // Initialize empty measurements if none exist
    if (!client.measurements) {
      console.log('No measurements found, initializing empty array');
      client.measurements = [{
        date: new Date().toLocaleDateString('es-ES'),
        values: {
          peso: 0,
          grasaCorporal: 0,
          pecho: 0,
          bicepDerecho: 0,
          bicepIzquierdo: 0,
          espalda: 0,
          cintura: 0,
          gluteos: 0,
          musloDerecho: 0,
          musloIzquierdo: 0,
          gemeloDerecho: 0,
          gemeloIzquierdo: 0
        }
      }];
      await client.save();
    }

    res.json({ 
      measurements: client.measurements,
      clientName: client.name // Include client name for UI feedback
    });
  } catch (err) {
    console.error('Error in measurements route:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid user ID format' });
    }
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Update client measurements
router.post('/measurements/:userId', auth, async (req, res) => {
  console.log('Updating measurements for userId:', req.params.userId);
  console.log('Received measurement data:', req.body);
  
  try {
    const trainer = await User.findById(req.user.id);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(403).json({ msg: 'Not authorized to update measurements' });
    }

    const client = await User.findById(req.params.userId);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    const { measurement } = req.body;
    
    // Initialize measurements array if it doesn't exist
    if (!client.measurements) {
      client.measurements = [];
    }

    // Add new measurement
    client.measurements.push(measurement);

    await client.save();
    console.log('Measurements updated successfully');
    
    res.json({ 
      msg: 'Measurements updated successfully',
      measurements: client.measurements
    });
  } catch (err) {
    console.error('Error updating measurements:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid user ID format' });
    }
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Add this new route handler for updating trainer status
router.put('/trainer-status/:trainerId', auth, async (req, res) => {
    try {
        console.log('Received request to update trainer status:', {
            trainerId: req.params.trainerId,
            requestedStatus: req.body.status,
            requestingUserId: req.user.id
        });

        // Verify that the requesting user is an admin
        const admin = await User.findById(req.user.id);
        console.log('Admin check:', {
            userFound: !!admin,
            userRole: admin?.role
        });

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to update trainer status' });
        }

        const trainer = await User.findById(req.params.trainerId);
        console.log('Trainer check:', {
            trainerFound: !!trainer,
            trainerRole: trainer?.role,
            currentStatus: trainer?.status
        });

        if (!trainer) {
            return res.status(404).json({ msg: 'Trainer not found' });
        }

        if (trainer.role !== 'trainer') {
            return res.status(400).json({ msg: 'User is not a trainer' });
        }

        trainer.status = req.body.status;
        await trainer.save();

        console.log('Status updated successfully:', {
            trainerId: trainer._id,
            newStatus: trainer.status
        });

        res.json({ trainer });
    } catch (err) {
        console.error('Detailed error in trainer status update:', {
            error: err.message,
            stack: err.stack,
            trainerId: req.params.trainerId,
            requestedStatus: req.body.status
        });
        res.status(500).json({ 
            msg: 'Server error',
            error: err.message
        });
    }
});

// Get all trainers with client count
router.get('/trainers', auth, async (req, res) => {
    try {
        // Verify that the requesting user is an admin
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to view trainers list' });
        }

        // Fetch all trainers
        const trainers = await User.find({ role: 'trainer' })
            .select('-password')
            .sort({ name: 1 });

        // For each trainer, count their clients
        const trainersWithClientCount = await Promise.all(trainers.map(async (trainer) => {
            const clientCount = await User.countDocuments({
                role: 'client',
                gymType: trainer._id.toString()
            });

            return {
                ...trainer.toObject(),
                clientCount
            };
        }));

        console.log('Trainers with client count:', trainersWithClientCount);
        res.json(trainersWithClientCount);
    } catch (err) {
        console.error('Error fetching trainers:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Get active trainers for client registration
router.get('/active-trainers', async (req, res) => {
    try {
        const activeTrainers = await User.find({
            role: 'trainer',
            status: 'active'
        })
        .select('_id name') // Only send necessary fields
        .sort({ name: 1 }); // Sort alphabetically by name

        console.log('Active trainers found:', activeTrainers.length);
        res.json(activeTrainers);
    } catch (err) {
        console.error('Error fetching active trainers:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Update user profile
router.put('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const {
            name,
            email,
            gymType,
            gender,
            age,
            height,
            objective,
            medicalCondition,
            currentPassword,
            newPassword
        } = req.body;

        // If password change is requested, verify current password
        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Current password is incorrect' });
            }
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.gymType = gymType || user.gymType;
        user.gender = gender || user.gender;
        user.age = age || user.age;
        user.height = height || user.height;
        user.objective = objective || user.objective;
        user.medicalCondition = medicalCondition || user.medicalCondition;

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(user._id).select('-password');
        res.json(updatedUser);

    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get trainer name by ID
router.get('/trainer/:trainerId', async (req, res) => {
    try {
        const trainer = await User.findOne({ 
            _id: req.params.trainerId,
            role: 'trainer'
        }).select('name');
        
        if (!trainer) {
            return res.status(404).json({ msg: 'Trainer not found' });
        }
        
        res.json({ name: trainer.name });
    } catch (err) {
        console.error('Error fetching trainer:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Get trainer stats
router.get('/trainer-stats', auth, async (req, res) => {
    try {
        // Verify that the requesting user is a trainer
        const trainer = await User.findById(req.user.id);
        if (!trainer || trainer.role !== 'trainer') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // Count clients for this trainer
        const clientCount = await User.countDocuments({
            role: 'client',
            gymType: trainer._id.toString()
        });

        res.json({
            clientCount,
            estimatedUsers: trainer.estimatedUsers
        });
    } catch (err) {
        console.error('Error fetching trainer stats:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
