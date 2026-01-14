const Appointment = require('../models/Appointment');

// POST /api/appointments - Patient books appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    
    // Get user ID from JWT - handle different payload structures
    const patientId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!patientId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Check if user is a patient (only patients can book appointments)
    if (req.user?.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    // Validate required fields
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing appointment conflict (same doctor, date, and time slot)
    const appointmentDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      timeSlot,
      status: { $in: ['Pending', 'Confirmed'] } // Only check active appointments
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        message: 'This time slot is already booked. Please choose another time slot.',
        conflict: true
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      date: new Date(date),
      timeSlot,
      status: 'Pending'
    });

    await appointment.save();
    await appointment.populate('doctorId', 'name email degree specialization');
    await appointment.populate('patientId', 'name email');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

// GET /api/appointments/patient - Patient views their appointments
const getPatientAppointments = async (req, res) => {
  try {
    // Get user ID from JWT - handle different payload structures
    const patientId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!patientId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'name email')
      .sort({ date: -1 }); // Sort by date, newest first

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// GET /api/appointments/doctor - Doctor views their appointments
const getDoctorAppointments = async (req, res) => {
  try {
    // Get user ID from JWT - handle different payload structures
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!doctorId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'name email')
      .sort({ date: -1 }); // Sort by date, newest first

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// PUT /api/appointments/:id - Doctor updates appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Get user ID from JWT - handle different payload structures
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!doctorId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Validate status
    if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find appointment and verify doctor owns it
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== doctorId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Update status
    appointment.status = status;
    await appointment.save();
    await appointment.populate('patientId', 'name email');
    await appointment.populate('doctorId', 'name email');

    res.status(200).json({
      message: 'Appointment status updated',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
