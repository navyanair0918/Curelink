import React, { useState } from 'react';
import { recordAPI } from '../services/api';
import FileViewer from './FileViewer';
import './DoctorRecordUpdate.css';

const DoctorRecordUpdate = () => {
  const [patientUsername, setPatientUsername] = useState('');
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [updateData, setUpdateData] = useState({
    prescription: '',
    diagnosis: ''
  });
  const [viewingFile, setViewingFile] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    file: null,
    category: 'prescription',
    title: '',
    description: '',
    prescription: '',
    diagnosis: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!patientUsername.trim()) {
      setError('Please enter patient email/username');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setRecords([]);
      setPatient(null);
      setEditingRecord(null);

      const response = await recordAPI.getPatientRecordsByUsername(patientUsername.trim());
      setRecords(response.data.records || []);
      setPatient(response.data.patient);
      setSuccess(`Found ${response.data.count} record(s) for ${response.data.patient.name}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patient records');
      setRecords([]);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record._id);
    setUpdateData({
      prescription: record.prescription || '',
      diagnosis: record.diagnosis || ''
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setUpdateData({ prescription: '', diagnosis: '' });
  };

  const handleUpdate = async (recordId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await recordAPI.updateRecord(recordId, updateData);
      
      setSuccess('Record updated successfully!');
      setEditingRecord(null);
      setUpdateData({ prescription: '', diagnosis: '' });
      
      // Refresh records
      if (patientUsername.trim()) {
        const response = await recordAPI.getPatientRecordsByUsername(patientUsername.trim());
        setRecords(response.data.records || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setUploadFormData({ ...uploadFormData, file });
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!patient) {
      setError('Please search for a patient first');
      return;
    }

    if (!uploadFormData.file) {
      setError('Please select a file');
      return;
    }

    if (!uploadFormData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const uploadFormDataObj = new FormData();
      uploadFormDataObj.append('file', uploadFormData.file);
      uploadFormDataObj.append('category', uploadFormData.category);
      uploadFormDataObj.append('title', uploadFormData.title.trim());
      uploadFormDataObj.append('description', uploadFormData.description.trim());
      uploadFormDataObj.append('prescription', uploadFormData.prescription.trim());
      uploadFormDataObj.append('diagnosis', uploadFormData.diagnosis.trim());
      uploadFormDataObj.append('patientEmail', patient.email);

      await recordAPI.uploadRecord(uploadFormDataObj);
      
      setSuccess('Record uploaded successfully!');
      setUploadFormData({
        file: null,
        category: 'prescription',
        title: '',
        description: '',
        prescription: '',
        diagnosis: ''
      });
      setShowUploadForm(false);
      
      // Refresh records
      if (patientUsername.trim()) {
        const response = await recordAPI.getPatientRecordsByUsername(patientUsername.trim());
        setRecords(response.data.records || []);
        setSuccess(`Record uploaded successfully! Found ${response.data.count} record(s) for ${response.data.patient.name}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getCategoryBadgeClass = (category) => {
    const classes = {
      prescription: 'badge-prescription',
      report: 'badge-report'
    };
    return classes[category] || '';
  };

  return (
    <div className="doctor-record-update">
      <div className="doctor-record-header">
        <h2>Update Patient Records</h2>
        <p>Search for a patient by email to view and update their medical records</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={patientUsername}
            onChange={(e) => setPatientUsername(e.target.value)}
            placeholder="Enter patient email (e.g., patient@gmail.com)"
            className="search-input"
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {patient && (
        <div className="patient-info">
          <div className="patient-info-header">
            <div>
              <h3>Patient Information</h3>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Email:</strong> {patient.email}</p>
            </div>
            <button 
              className="btn-upload-record" 
              onClick={() => setShowUploadForm(!showUploadForm)}
            >
              {showUploadForm ? 'Cancel Upload' : '+ Upload Record'}
            </button>
          </div>
        </div>
      )}

      {patient && showUploadForm && (
        <div className="upload-form-container">
          <form onSubmit={handleUpload} className="upload-form">
            <h3>Upload Record for {patient.name}</h3>
            
            <div className="form-group">
              <label>Category *</label>
              <select
                value={uploadFormData.category}
                onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                required
              >
                <option value="prescription">Prescription</option>
                <option value="report">Report</option>
              </select>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={uploadFormData.title}
                onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                placeholder="e.g., Blood Test Report - Jan 2024"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                placeholder="Optional description..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Prescription</label>
              <textarea
                value={uploadFormData.prescription}
                onChange={(e) => setUploadFormData({ ...uploadFormData, prescription: e.target.value })}
                placeholder="Enter prescription details..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Diagnosis</label>
              <textarea
                value={uploadFormData.diagnosis}
                onChange={(e) => setUploadFormData({ ...uploadFormData, diagnosis: e.target.value })}
                placeholder="Enter diagnosis details..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>File *</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
                required
              />
              {uploadFormData.file && (
                <div className="file-info">
                  Selected: {uploadFormData.file.name} ({formatFileSize(uploadFormData.file.size)})
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Record'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadFormData({
                    file: null,
                    category: 'prescription',
                    title: '',
                    description: '',
                    prescription: '',
                    diagnosis: ''
                  });
                  setError('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {records.length > 0 && (
        <div className="records-section">
          <h3>Patient Records ({records.length})</h3>
          <div className="records-list">
            {records.map((record) => (
              <div key={record._id} className="record-card">
                <div className="record-header">
                  <span className={`category-badge ${getCategoryBadgeClass(record.category)}`}>
                    {record.category.charAt(0).toUpperCase() + record.category.slice(1)}
                  </span>
                </div>
                
                {record.createdBy === 'doctor' && record.doctorId && (
                  <div className="doctor-upload-badge">
                    👨‍⚕️ Uploaded by Dr. {record.doctorId.name}
                    {record.doctorId.specialization && (
                      <span className="doctor-specialization"> ({record.doctorId.specialization})</span>
                    )}
                  </div>
                )}
                {record.createdBy === 'patient' && (
                  <div className="patient-upload-badge">
                    👤 Uploaded by Patient
                  </div>
                )}
                
                <h4 className="record-title">{record.title}</h4>
                
                {record.description && (
                  <p className="record-description">{record.description}</p>
                )}

                {editingRecord === record._id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Prescription</label>
                      <textarea
                        value={updateData.prescription}
                        onChange={(e) => setUpdateData({ ...updateData, prescription: e.target.value })}
                        placeholder="Enter prescription details..."
                        rows="4"
                        className="form-textarea"
                      />
                    </div>
                    <div className="form-group">
                      <label>Diagnosis</label>
                      <textarea
                        value={updateData.diagnosis}
                        onChange={(e) => setUpdateData({ ...updateData, diagnosis: e.target.value })}
                        placeholder="Enter diagnosis details..."
                        rows="4"
                        className="form-textarea"
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        onClick={() => handleUpdate(record._id)}
                        className="btn-save"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-cancel"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {record.prescription && (
                      <div className="record-update">
                        <strong>Prescription:</strong>
                        <p>{record.prescription}</p>
                        {record.lastUpdatedBy && (
                          <small>Updated by Dr. {record.lastUpdatedBy.name} on {formatDate(record.updatedAt)}</small>
                        )}
                      </div>
                    )}

                    {record.diagnosis && (
                      <div className="record-update">
                        <strong>Diagnosis:</strong>
                        <p>{record.diagnosis}</p>
                        {record.lastUpdatedBy && (
                          <small>Updated by Dr. {record.lastUpdatedBy.name} on {formatDate(record.updatedAt)}</small>
                        )}
                      </div>
                    )}

                    {(!record.prescription && !record.diagnosis) && (
                      <div className="no-updates">
                        <p>No prescription or diagnosis added yet.</p>
                      </div>
                    )}

                    <div className="record-footer">
                      <div className="record-file">
                        <button
                          onClick={() => setViewingFile({
                            id: record._id,
                            fileName: record.fileName,
                            fileType: record.fileType
                          })}
                          className="file-link"
                        >
                          📄 {record.fileName}
                        </button>
                        <span className="file-size">{formatFileSize(record.fileSize)}</span>
                      </div>
                      <div className="record-date">
                        Uploaded: {formatDate(record.createdAt)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleEdit(record)}
                      className="btn-edit"
                    >
                      {record.prescription || record.diagnosis ? 'Edit' : 'Add'} Prescription/Diagnosis
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && patientUsername && records.length === 0 && patient && (
        <div className="empty-records">
          <p>No records found for this patient.</p>
        </div>
      )}

      {viewingFile && (
        <FileViewer
          recordId={viewingFile.id}
          fileName={viewingFile.fileName}
          fileType={viewingFile.fileType}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
};

export default DoctorRecordUpdate;
