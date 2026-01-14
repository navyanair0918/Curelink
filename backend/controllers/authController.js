const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '7d' });
};

// POST /api/auth/register - Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email, and password are required' 
      });
    }

    // Validate email format (Gmail only)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid Gmail address' 
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character' 
      });
    }

    // Validate role - only patient or doctor allowed (admin cannot be registered)
    // Normalize role to lowercase
    const normalizedRole = role ? role.toLowerCase() : 'patient';
    const allowedRoles = ['patient', 'doctor'];
    const userRole = normalizedRole;
    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role. You can only register as Patient or Doctor. Admin accounts cannot be created through registration.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save hook
      role: userRole
    };

    // Add doctor-specific fields if registering as doctor
    if (userRole === 'doctor') {
      if (req.body.degree) {
        userData.degree = req.body.degree.trim();
      }
      if (req.body.specialization) {
        userData.specialization = req.body.specialization.trim();
      }
    }

    const user = new User(userData);

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (password excluded by toJSON method)
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating account', 
      error: error.message 
    });
  }
};

// POST /api/auth/login - Login user
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid Gmail address' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    console.log(`User found: ${user.email}, Role: ${user.role}, Requested role: ${role}`);

    // Check role if provided (case-insensitive comparison)
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      console.log(`Role mismatch: User role is ${user.role}, but ${role} was requested`);
      return res.status(403).json({ 
        success: false,
        message: `Access denied. This account is registered as ${user.role}, not ${role}` 
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log(`Password mismatch for user: ${user.email}`);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    console.log(`✅ Login successful for ${user.email} as ${user.role}`);

    // Generate token
    const token = generateToken(user._id);

    // Return user data (password excluded by toJSON method)
    res.status(200).json({
      success: true,
      message: `${user.role.toUpperCase()} login successful`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

// GET /api/auth/me - Get current user (protected route)
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'User ID not found in token' 
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user', 
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
