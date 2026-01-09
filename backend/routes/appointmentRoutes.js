const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const auth = require('../middleware/auth'); // JWT middleware (assumed to exist)

// POST /api/appointments - Patient books appointment
router.post('/', auth, bookAppointment);

// GET /api/appointments/patient - Patient views appointments
router.get('/patient', auth, getPatientAppointments);

// GET /api/appointments/doctor - Doctor views appointments
router.get('/doctor', auth, getDoctorAppointments);

// PUT /api/appointments/:id - Doctor updates appointment status
router.put('/:id', auth, updateAppointmentStatus);

module.exports = router;
