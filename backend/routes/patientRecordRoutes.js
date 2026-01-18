const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadRecord,
  getMyRecords,
  getPatientRecordsByUsername,
  updateRecord,
  getRecordFile,
  deleteRecord
} = require('../controllers/patientRecordController');

// POST /api/records/upload - Upload a patient record (patient only)
router.post('/upload', auth, upload.single('file'), uploadRecord);

// GET /api/records/my-records - Get all records for logged-in patient
router.get('/my-records', auth, getMyRecords);

// GET /api/records/patient/:username - Get patient records by username (doctor only)
router.get('/patient/:username', auth, getPatientRecordsByUsername);

// PUT /api/records/:recordId/update - Update prescription/diagnosis (doctor only)
router.put('/:recordId/update', auth, updateRecord);

// GET /api/records/:recordId/file - Download/view file
router.get('/:recordId/file', auth, getRecordFile);

// DELETE /api/records/:recordId - Delete a record (patient only)
router.delete('/:recordId', auth, deleteRecord);

module.exports = router;
