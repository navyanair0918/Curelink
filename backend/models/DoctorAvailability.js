const mongoose = require('mongoose');

const doctorAvailabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  
  unavailableDates: [{
    type: Date,
    required: true
  }],
  
  unavailableTimeSlots: [{
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    }
  }],
  
  recurringUnavailableSlots: [{
    type: String 
  }]
}, {
  timestamps: true
});


doctorAvailabilitySchema.index({ doctorId: 1 });

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
