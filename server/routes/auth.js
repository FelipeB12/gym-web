const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

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

    // Create and return a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.name // Include the user's name in the payload
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ msg: 'Error creating token', error: err.message });
        }
        console.log('JWT created for user:', email);
        res.json({ token, name: user.name }); // Return the user's name along with the token
      }
    );
  } catch (err) {
    console.error('Error during login:', err); // Log the error
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
    console.log('Received registration request:', req.body);
    try {
        const { name, email, password, role, gymType, gender, age, height, weight, objective, medicalCondition } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Get current date in DD/MM/YYYY format
        const today = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Create initial measurement with current date
        const initialMeasurement = {
            date: today,
            values: {
                peso: weight || 0,
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
        };

        // Create initial routine structure
        const initialRoutine = {
            date: today,
            values: {
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": [],
                "6": [],
                "7": []
            }
        };

        // Determine membership value based on gymType
        let membership = 0;
        if (gymType === 'test-gym') {
            membership = 60;
        }

        // Create new user with explicit measurements and routine
        const newUser = {
            name,
            email,
            password,
            role: role || 'client',
            gymType,
            membership,
            gender,
            age: Number(age),
            height: Number(height),
            weight: Number(weight),
            objective,
            medicalCondition,
            measurements: [initialMeasurement],
            routine: [initialRoutine]  // Add the routine here
        };

        user = new User(newUser);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();
        console.log('New user created:', {
            measurements: user.measurements,
            routine: user.routine  // Log the routine to verify it's being saved
        });

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
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get user data
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); // Return user data
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update user data
router.put('/user', auth, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if email is being changed and if it's already in use
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    // Update basic fields
    user.name = name || user.name;
    user.email = email || user.email;

    // Handle password update if provided
    if (newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      // Verify password confirmation
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: 'New passwords do not match' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save updated user
    await user.save();

    res.json({ msg: 'Profile updated successfully', user: {
      name: user.name,
      email: user.email
    }});
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
});

// Trainer specific routes
router.get('/clients', auth, async (req, res) => {
  try {
    // Check if the requesting user is a trainer
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.role !== 'trainer') {
      return res.status(403).json({ msg: 'Not authorized to view clients' });
    }

    // Fetch only clients and select specific fields
    const clients = await User.find(
      { role: 'client' },
      'name email _id' // Only return these fields
    );
    
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get specific user data (for trainer to view client)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if the requesting user is a trainer
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.role !== 'trainer') {
      return res.status(403).json({ msg: 'Not authorized to view client data' });
    }

    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Workout routes
router.get('/workouts', auth, async (req, res) => {
    // ... existing workout get code ...
});

router.post('/workouts', auth, async (req, res) => {
    // ... existing workout post code ...
});

// Book appointment
router.post('/appointments', auth, async (req, res) => {
    try {
        const { date, time } = req.body;
        
        // Get client user
        const client = await User.findById(req.user.id);
        if (!client) {
            return res.status(404).json({ msg: 'Client not found' });
        }

        // Find trainer (assuming there's only one trainer for now)
        const trainer = await User.findOne({ role: 'trainer' });
        if (!trainer) {
            return res.status(404).json({ msg: 'No trainer found' });
        }

        // Create appointment object
        const appointment = {
            date,
            time,
            clientId: client._id,
            clientName: client.name,
            status: 'pending'
        };

        // Initialize appointments array if it doesn't exist
        if (!trainer.appointments) trainer.appointments = [];
        if (!client.appointments) client.appointments = [];

        // Add appointment to both client and trainer
        trainer.appointments.push(appointment);
        client.appointments.push(appointment);

        // Save both documents
        await Promise.all([
            trainer.save(),
            client.save()
        ]);

        res.json({ 
            msg: 'Appointment booked successfully', 
            appointment 
        });
    } catch (err) {
        console.error('Error booking appointment:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get appointments (works for both trainer and client)
router.get('/appointments', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // If user is a trainer, get all appointments
        if (user.role === 'trainer') {
            // Return trainer's appointments directly
            return res.json({ 
                appointments: user.appointments || [] 
            });
        }

        // If user is a client, return only their appointments
        res.json({ 
            appointments: user.appointments || [] 
        });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update appointment status (trainer only)
router.put('/appointments/:appointmentId', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentId = req.params.appointmentId;

        // Verify user is a trainer
        const trainer = await User.findById(req.user.id);
        if (!trainer || trainer.role !== 'trainer') {
            return res.status(403).json({ msg: 'Not authorized to update appointments' });
        }

        // Find the client who owns this appointment
        const clients = await User.find({ role: 'client' });
        let updatedClient = null;

        // Update appointment status for the client
        for (let client of clients) {
            const appointmentIndex = client.appointments.findIndex(
                apt => apt._id.toString() === appointmentId
            );
            
            if (appointmentIndex !== -1) {
                client.appointments[appointmentIndex].status = status;
                await client.save();
                updatedClient = client;
                break;
            }
        }

        // Update trainer's copy of the appointment
        const trainerAppointmentIndex = trainer.appointments.findIndex(
            apt => apt._id.toString() === appointmentId
        );
        
        if (trainerAppointmentIndex !== -1) {
            trainer.appointments[trainerAppointmentIndex].status = status;
            await trainer.save();
        }

        if (!updatedClient) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        res.json({ success: true, msg: 'Appointment status updated' });
    } catch (err) {
        console.error('Error updating appointment status:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete appointment
router.delete('/appointments/:appointmentId', auth, async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const client = await User.findById(req.user.id);
        
        if (!client) {
            return res.status(404).json({ msg: 'Client not found' });
        }

        // Find the appointment in client's appointments
        const appointmentIndex = client.appointments.findIndex(
            apt => apt._id.toString() === appointmentId
        );

        if (appointmentIndex === -1) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        // Check if appointment is already confirmed
        if (client.appointments[appointmentIndex].status === 'confirmed') {
            return res.status(400).json({ msg: 'Cannot delete confirmed appointments' });
        }

        // Remove appointment from client's appointments
        client.appointments.splice(appointmentIndex, 1);
        await client.save();

        // Remove appointment from trainer's appointments
        const trainer = await User.findOne({ role: 'trainer' });
        if (trainer) {
            const trainerAppointmentIndex = trainer.appointments.findIndex(
                apt => apt._id.toString() === appointmentId
            );
            if (trainerAppointmentIndex !== -1) {
                trainer.appointments.splice(trainerAppointmentIndex, 1);
                await trainer.save();
            }
        }

        res.json({ success: true, msg: 'Appointment deleted successfully' });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
