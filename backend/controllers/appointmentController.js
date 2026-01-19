const Appointment = require('../models/Appointment');
const DoctorAvailability = require('../models/DoctorAvailability');

const bookAppointment = async (req, res) => {
  try 
  {
    const { doctorId, date, timeSlot } = req.body;
    
    const patientId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!patientId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    if (req.user?.role !== 'patient') 
    {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    if (!doctorId || !date || !timeSlot) 
    {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const appointmentDate = new Date(date);
    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);

    const doctorAvailability = await DoctorAvailability.findOne({ doctorId });
    
    if (doctorAvailability) 
    {
      const isDateUnavailable = doctorAvailability.unavailableDates.some(unavailableDate => {
        const uDate = new Date(unavailableDate);
        uDate.setHours(0, 0, 0, 0);
        return uDate.getTime() === appointmentDay.getTime();
      });

      if (isDateUnavailable) 
      {
        return res.status(409).json({ 
          message: 'Doctor is not available on this date. Please choose another date.',
          conflict: true
        });
      }

      const isTimeSlotUnavailable = doctorAvailability.unavailableTimeSlots.some(slot => {
        const slotDate = new Date(slot.date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === appointmentDay.getTime() && slot.timeSlot === timeSlot;
      });

      if (isTimeSlotUnavailable) 
      {
        return res.status(409).json({ 
          message: 'Doctor is not available at this time slot. Please choose another time.',
          conflict: true
        });
      }
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      timeSlot,
      status: { $in: ['Pending', 'Confirmed'] } // Only check active appointments
    });

    if (existingAppointment) 
    {
      return res.status(409).json({ 
        message: 'This time slot is already booked. Please choose another time slot.',
        conflict: true
      });
    }

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

const getPatientAppointments = async (req, res) => {
  try 
  {
    const patientId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!patientId) 
    {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'name email')
      .sort({ date: -1 }); 
    res.status(200).json({ appointments });
  } 
  catch (error) 
  {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try 
  {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!doctorId) 
    {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'name email')
      .sort({ date: -1 }); 

    res.status(200).json({ appointments });
  } 
  catch (error) 
  {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try 
  {
    const { id } = req.params;
    const { status } = req.body;
    
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!doctorId) 
    {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    if (!['Pending', 'Confirmed', 'Completed'].includes(status)) 
    {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) 
    {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== doctorId) 
    {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();
    await appointment.populate('patientId', 'name email');
    await appointment.populate('doctorId', 'name email');

    res.status(200).json({
      message: 'Appointment status updated',
      appointment
    });
  } 
  catch (error) 
  {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

module.exports = 
{
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
