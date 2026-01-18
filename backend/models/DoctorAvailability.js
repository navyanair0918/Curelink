const mongoose = require('mongoose');

// Doctor Availability Schema
const doctorAvailabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One availability record per doctor
  },
  // Array of unavailable dates
  unavailableDates: [{
    type: Date,
    required: true
  }],
  // Array of unavailable time slots (for specific dates or recurring)
  unavailableTimeSlots: [{
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String, // e.g., "09:00 AM"
      required: true
    }
  }],
  // General unavailable time slots (apply to all dates)
  // For example, if doctor doesn't work on specific time slots every day
  recurringUnavailableSlots: [{
    type: String // e.g., "01:00 PM"
  }]
}, {
  timestamps: true
});

// Index for faster queries
doctorAvailabilitySchema.index({ doctorId: 1 });

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
