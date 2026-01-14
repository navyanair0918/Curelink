const express = require('express');
const router = express.Router();
const { getAllDoctors, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

// GET /api/users/doctors - Get all doctors (protected route)
router.get('/doctors', auth, getAllDoctors);

// PUT /api/users/profile - Update user profile (protected route)
router.put('/profile', auth, updateProfile);

module.exports = router;
