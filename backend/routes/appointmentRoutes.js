const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const auth = require('../middleware/auth'); 

router.post('/', auth, bookAppointment);

router.get('/patient', auth, getPatientAppointments);

router.get('/doctor', auth, getDoctorAppointments);

router.put('/:id', auth, updateAppointmentStatus);

module.exports = router;
