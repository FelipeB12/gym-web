router.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();
    console.log('New user created:', user.email);

    // Create and return a JWT
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
        console.log('JWT created for user:', user.email);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Server error during registration:', err.message);
    console.error(err.stack);  // Add this line to get the full error stack
    res.status(500).send('Server error');
  }
});