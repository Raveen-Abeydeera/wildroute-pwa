const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- REGISTER (Sign Up) ---
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password } = req.body;

    // 1. Check if user already exists
    // If mobileNumber is provided, check both; otherwise just check email
    const query = mobileNumber
      ? { $or: [{ email }, { mobileNumber }] }
      : { email };

    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or mobile already exists.' });
    }

    // 2. Create new user (Password hashing is handled by User model pre-save hook)
    let role = 'user';
    if (email.endsWith('@slwildlife.lk')) {
      role = 'ranger';
    }

    const newUser = new User({
      fullName,
      email,
      mobileNumber, // Optional
      password,
      role
    });

    const savedUser = await newUser.save();

    // Generate token for immediate login
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.status(201).json({
      message: 'User registered successfully!',
      userId: savedUser._id,
      role: savedUser.role,
      token // Sending token so frontend can auto-login if needed
    });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Check password using model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Generate Token (This is their "digital ID card" for the session)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    // 4. Send back info (excluding password)
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        points: user.points,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;