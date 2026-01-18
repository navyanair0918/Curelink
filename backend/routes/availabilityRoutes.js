const express = require('express');
const router = express.Router();
const {
  getAvailability,
  addUnavailableDate,
  removeUnavailableDate,
  addUnavailableTimeSlot,
  removeUnavailableTimeSlot
} = require('../controllers/availabilityController');
const auth = require('../middleware/auth');

// All routes require authentication and doctor role
router.get('/', auth, getAvailability);
router.post('/unavailable-date', auth, addUnavailableDate);
router.delete('/unavailable-date', auth, removeUnavailableDate);
router.post('/unavailable-slot', auth, addUnavailableTimeSlot);
router.delete('/unavailable-slot', auth, removeUnavailableTimeSlot);

module.exports = router;
