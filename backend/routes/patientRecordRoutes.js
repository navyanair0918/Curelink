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

router.post('/upload', auth, upload.single('file'), uploadRecord);

router.get('/my-records', auth, getMyRecords);

router.get('/patient/:username', auth, getPatientRecordsByUsername);

router.put('/:recordId/update', auth, updateRecord);

router.get('/:recordId/file', auth, getRecordFile);

router.delete('/:recordId', auth, deleteRecord);

module.exports = router;
