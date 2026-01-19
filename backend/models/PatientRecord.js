const mongoose = require('mongoose');

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
    default: null 
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
  timestamps: true 
});

patientRecordSchema.index({ patientId: 1, createdAt: -1 });
patientRecordSchema.index({ doctorId: 1 });

module.exports = mongoose.model('PatientRecord', patientRecordSchema);
