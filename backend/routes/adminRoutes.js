const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  getDashboardStats
} = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // Get user from token (set by auth middleware)
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// All admin routes require authentication and admin role
router.get('/users', auth, isAdmin, getAllUsers);
router.get('/patients', auth, isAdmin, getAllPatients);
router.get('/doctors', auth, isAdmin, getAllDoctors);
router.get('/appointments', auth, isAdmin, getAllAppointments);
router.get('/stats', auth, isAdmin, getDashboardStats);

module.exports = router;
