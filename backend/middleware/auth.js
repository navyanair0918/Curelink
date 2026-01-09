const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
// This middleware verifies the JWT token and attaches user info to req.user
const auth = (req, res, next) => {
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
    
    // Attach user info to request
    // Handle different JWT payload structures (id, userId, _id, user.id, etc.)
    req.user = {
      id: decoded.id || decoded.userId || decoded._id || decoded.user?.id || decoded.userId,
      ...decoded
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
    return res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth;
