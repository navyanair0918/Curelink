const DoctorAvailability = require('../models/DoctorAvailability');

// GET /api/availability - Get doctor's availability
const getAvailability = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!doctorId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access availability' });
    }

    let availability = await DoctorAvailability.findOne({ doctorId });
    
    // If no availability record exists, create one with empty arrays
    if (!availability) {
      availability = new DoctorAvailability({
        doctorId,
        unavailableDates: [],
        unavailableTimeSlots: [],
        recurringUnavailableSlots: []
      });
      await availability.save();
    }

    res.status(200).json({
      success: true,
      availability
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching availability', 
      error: error.message 
    });
  }
};

// POST /api/availability/unavailable-date - Add unavailable date
const addUnavailableDate = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    const { date } = req.body;
    
    if (!doctorId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can manage availability' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    let availability = await DoctorAvailability.findOne({ doctorId });
    
    if (!availability) {
      availability = new DoctorAvailability({
        doctorId,
        unavailableDates: [],
        unavailableTimeSlots: [],
        recurringUnavailableSlots: []
      });
    }

    const unavailableDate = new Date(date);
    unavailableDate.setHours(0, 0, 0, 0);

    // Check if date already exists
    const dateExists = availability.unavailableDates.some(d => {
      const dDate = new Date(d);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() === unavailableDate.getTime();
    });

    if (dateExists) {
      return res.status(400).json({ message: 'This date is already marked as unavailable' });
    }

    availability.unavailableDates.push(unavailableDate);
    await availability.save();

    res.status(200).json({
      success: true,
      message: 'Date marked as unavailable',
      availability
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding unavailable date', 
      error: error.message 
    });
  }
};

// DELETE /api/availability/unavailable-date - Remove unavailable date
const removeUnavailableDate = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    const { date } = req.body;
    
    if (!doctorId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can manage availability' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const availability = await DoctorAvailability.findOne({ doctorId });
    
    if (!availability) {
      return res.status(404).json({ message: 'Availability record not found' });
    }

    const unavailableDate = new Date(date);
    unavailableDate.setHours(0, 0, 0, 0);

    availability.unavailableDates = availability.unavailableDates.filter(d => {
      const dDate = new Date(d);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() !== unavailableDate.getTime();
    });

    await availability.save();

    res.status(200).json({
      success: true,
      message: 'Date removed from unavailable dates',
      availability
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing unavailable date', 
      error: error.message 
    });
  }
};

// POST /api/availability/unavailable-slot - Add unavailable time slot
const addUnavailableTimeSlot = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    const { date, timeSlot } = req.body;
    
    if (!doctorId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can manage availability' });
    }

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and time slot are required' });
    }

    let availability = await DoctorAvailability.findOne({ doctorId });
    
    if (!availability) {
      availability = new DoctorAvailability({
        doctorId,
        unavailableDates: [],
        unavailableTimeSlots: [],
        recurringUnavailableSlots: []
      });
    }

    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    // Check if slot already exists
    const slotExists = availability.unavailableTimeSlots.some(slot => {
      const sDate = new Date(slot.date);
      sDate.setHours(0, 0, 0, 0);
      return sDate.getTime() === slotDate.getTime() && slot.timeSlot === timeSlot;
    });

    if (slotExists) {
      return res.status(400).json({ message: 'This time slot is already marked as unavailable' });
    }

    availability.unavailableTimeSlots.push({ date: slotDate, timeSlot });
    await availability.save();

    res.status(200).json({
      success: true,
      message: 'Time slot marked as unavailable',
      availability
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding unavailable time slot', 
      error: error.message 
    });
  }
};

// DELETE /api/availability/unavailable-slot - Remove unavailable time slot
const removeUnavailableTimeSlot = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    const { date, timeSlot } = req.body;
    
    if (!doctorId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can manage availability' });
    }

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and time slot are required' });
    }

    const availability = await DoctorAvailability.findOne({ doctorId });
    
    if (!availability) {
      return res.status(404).json({ message: 'Availability record not found' });
    }

    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    availability.unavailableTimeSlots = availability.unavailableTimeSlots.filter(slot => {
      const sDate = new Date(slot.date);
      sDate.setHours(0, 0, 0, 0);
      return !(sDate.getTime() === slotDate.getTime() && slot.timeSlot === timeSlot);
    });

    await availability.save();

    res.status(200).json({
      success: true,
      message: 'Time slot removed from unavailable slots',
      availability
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing unavailable time slot', 
      error: error.message 
    });
  }
};

module.exports = {
  getAvailability,
  addUnavailableDate,
  removeUnavailableDate,
  addUnavailableTimeSlot,
  removeUnavailableTimeSlot
};
