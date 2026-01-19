const express = require('express');
const router = express.Router();
const { getAllDoctors, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/doctors', auth, getAllDoctors);

router.put('/profile', auth, updateProfile);

module.exports = router;
