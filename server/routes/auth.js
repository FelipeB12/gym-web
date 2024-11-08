const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = require('../middleware/auth')

// Registration route
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

        // Determine membership value based on gymType
        let membership = 0;
        if (gymType === 'test-gym') {
            membership = 60;
        }

        // Create new user with explicit measurements
        const newUser = {
            name,
            email,
            password,
            role: role || 'client',
            membership,
            gender,
            age,
            height,
            weight,
            objective,
            medicalCondition,
            measurements: [initialMeasurement] // Store as array
        };

        user = new User(newUser);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();
        console.log('New user created with measurements:', user.measurements);

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
                if (err) {
                    console.error('JWT sign error:', err);
                    return res.status(500).json({ msg: 'Error creating token', error: err.message });
                }
                console.log('JWT created for user:', email);
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

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

// Add this route to fetch user data
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

// Add this new route for updating user profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const { name, email, gymType, gender, age, height, weight, objective, medicalCondition } = req.body;

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (gymType) user.gymType = gymType;
    if (gender) user.gender = gender;
    if (age) user.age = parseInt(age);
    if (height) user.height = parseInt(height);
    if (weight) user.weight = parseInt(weight);
    if (objective) user.objective = objective;
    if (medicalCondition !== undefined) user.medicalCondition = medicalCondition;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add this new route for updating measurements
router.put('/update-measurements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Update measurements
    if (req.body.measurements) {
      user.measurements = {
        ...user.measurements,
        ...req.body.measurements
      };
    }

    await user.save();
    res.json(user.measurements);
  } catch (err) {
    console.error('Error updating measurements:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add or update measurements route
router.post('/measurements', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Get current date in DD/MM/YYYY format
        const today = new Date();
        const date = today.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Create new measurement
        const newMeasurement = {
            date: date,
            values: req.body.values
        };

        // Add new measurement to the array
        user.measurements.push(newMeasurement);

        await user.save();
        res.json(user.measurements);
    } catch (err) {
        console.error('Error updating measurements:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
