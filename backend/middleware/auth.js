const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try 
  {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) 
    {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;

    if (!token) 
    {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret);
    
    const userId = decoded.id || decoded.userId || decoded._id || decoded.user?.id;
    
    if (!userId) 
    {
      return res.status(401).json({ message: 'Invalid token: user ID not found' });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) 
    {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = {
      id: user._id.toString(),
      _id: user._id,
      userId: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    };
    
    next();
  } 
  catch (error) 
  {
    if (error.name === 'JsonWebTokenError') 
    {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    if (error.name === 'TokenExpiredError') 
    {
      return res.status(401).json({ message: 'Token has expired' });
    }
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth;
