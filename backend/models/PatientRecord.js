const mongoose = require('mongoose');

// Patient Record Schema
const patientRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null if uploaded by patient
  },
  category: {
    type: String,
    enum: ['prescription', 'report'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  // File information
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  // Doctor's prescription/diagnosis update
  prescription: {
    type: String,
    trim: true,
    default: ''
  },
  diagnosis: {
    type: String,
    trim: true,
    default: ''
  },
  // Track who created and last updated
  createdBy: {
    type: String,
    enum: ['patient', 'doctor'],
    default: 'patient'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for efficient queries
patientRecordSchema.index({ patientId: 1, createdAt: -1 });
patientRecordSchema.index({ doctorId: 1 });

module.exports = mongoose.model('PatientRecord', patientRecordSchema);
