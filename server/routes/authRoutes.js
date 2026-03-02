const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- REGISTER (Sign Up) ---
router.post('/register', async (req, res) => {
  try {
    // 1. ADD 'phone' to the extracted body data
    const { fullName, email, phone, password, role, departmentId } = req.body;

    // 2. Validate input
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields, including phone number' });
    }

    // 3. Check if user exists (by email or phone)
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // 4. Create user
    let finalRole = role || 'user';
    if (email && email.endsWith('@slwildlife.lk') && !role) {
      finalRole = 'ranger';
    }

    const savedUser = await User.create({
      fullName,
      email,
      phone, // Save the phone number
      password,
      role: finalRole,
      departmentId: finalRole === 'ranger' ? departmentId : undefined
    });

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