const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Authentication Middleware
// This middleware verifies the JWT token and attaches user info to req.user
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Handle both "Bearer token" and just "token" formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token - try with JWT_SECRET from env, or use default
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Get user ID from decoded token
    const userId = decoded.id || decoded.userId || decoded._id || decoded.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: user ID not found' });
    }

    // Fetch user from database to get current role and other info
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach full user info to request (including role)
    req.user = {
      id: user._id.toString(),
      _id: user._id,
      userId: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (error) {
    // Provide more specific error messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth;
