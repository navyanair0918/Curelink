const PatientRecord = require('../models/PatientRecord');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// POST /api/records/upload - Upload a patient record (patient or doctor)
const uploadRecord = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { category, title, description, prescription, diagnosis, patientEmail } = req.body;
    let patientId = userId;

    // If doctor is uploading, they must provide patient email
    if (req.user?.role === 'doctor') {
      if (!patientEmail || patientEmail.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Patient email is required when uploading as a doctor'
        });
      }

      // Find patient by email
      const patient = await User.findOne({ 
        email: patientEmail.toLowerCase().trim(),
        role: 'patient'
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found with the provided email'
        });
      }

      patientId = patient._id;
    } else if (req.user?.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients and doctors can upload records'
      });
    }

    if (!category || !['prescription', 'report'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Valid category is required (prescription or report)'
      });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const recordData = {
      patientId: patientId,
      category: category,
      title: title.trim(),
      description: description ? description.trim() : '',
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      createdBy: req.user?.role === 'doctor' ? 'doctor' : 'patient'
    };

    // If doctor is uploading, include doctor ID and prescription/diagnosis
    if (req.user?.role === 'doctor') {
      recordData.doctorId = userId;
      recordData.lastUpdatedBy = userId;
      if (prescription) recordData.prescription = prescription.trim();
      if (diagnosis) recordData.diagnosis = diagnosis.trim();
    }

    const record = new PatientRecord(recordData);
    await record.save();

    // Populate doctor info for response
    const populatedRecord = await PatientRecord.findById(record._id)
      .populate('doctorId', 'name email specialization')
      .populate('patientId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Record uploaded successfully',
      record: populatedRecord
    });
  } catch (error) {
    console.error('Upload record error:', error);
    
    // Delete uploaded file if record creation failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading record',
      error: error.message
    });
  }
};

// GET /api/records/my-records - Get all records for logged-in patient
const getMyRecords = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Only patients can view their own records
    if (req.user?.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can view their own records'
      });
    }

    const records = await PatientRecord.find({ patientId: userId })
      .populate('doctorId', 'name email specialization')
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error('Get my records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching records',
      error: error.message
    });
  }
};

// GET /api/records/patient/:username - Get patient records by username (doctor only)
const getPatientRecordsByUsername = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Only doctors can access this
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can access patient records'
      });
    }

    const { username } = req.params;
    
    // Find patient by email (username)
    const patient = await User.findOne({ 
      email: username.toLowerCase(),
      role: 'patient'
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const records = await PatientRecord.find({ patientId: patient._id })
      .populate('doctorId', 'name email specialization')
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email
      },
      count: records.length,
      records
    });
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient records',
      error: error.message
    });
  }
};

// PUT /api/records/:recordId/update - Update prescription/diagnosis (doctor only)
const updateRecord = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Only doctors can update records
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can update records'
      });
    }

    const { recordId } = req.params;
    const { prescription, diagnosis } = req.body;

    const record = await PatientRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Update fields
    const updateData = {};
    if (prescription !== undefined) {
      updateData.prescription = prescription.trim();
    }
    if (diagnosis !== undefined) {
      updateData.diagnosis = diagnosis.trim();
    }
    updateData.lastUpdatedBy = doctorId;
    updateData.doctorId = doctorId;

    const updatedRecord = await PatientRecord.findByIdAndUpdate(
      recordId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('doctorId', 'name email specialization')
      .populate('lastUpdatedBy', 'name email')
      .populate('patientId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      record: updatedRecord
    });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating record',
      error: error.message
    });
  }
};

// GET /api/records/:recordId/file - Download/view file
const getRecordFile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    const { recordId } = req.params;

    const record = await PatientRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Check if user has access (patient owns it, or doctor accessing patient's record)
    if (req.user?.role === 'patient') {
      if (record.patientId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user?.role === 'doctor') {
      // Doctors can access any patient's records
      // (In production, you might want to add additional checks)
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!fs.existsSync(record.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.setHeader('Content-Disposition', `inline; filename="${record.fileName}"`);
    res.setHeader('Content-Type', record.fileType);
    res.sendFile(path.resolve(record.filePath));
  } catch (error) {
    console.error('Get record file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file',
      error: error.message
    });
  }
};

// DELETE /api/records/:recordId - Delete a record (patient only)
const deleteRecord = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Only patients can delete their own records
    if (req.user?.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can delete their own records'
      });
    }

    const { recordId } = req.params;

    const record = await PatientRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Check ownership
    if (record.patientId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete file
    if (fs.existsSync(record.filePath)) {
      fs.unlinkSync(record.filePath);
    }

    await PatientRecord.findByIdAndDelete(recordId);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting record',
      error: error.message
    });
  }
};

module.exports = {
  uploadRecord,
  getMyRecords,
  getPatientRecordsByUsername,
  updateRecord,
  getRecordFile,
  deleteRecord
};
