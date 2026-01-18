import React, { useState, useEffect } from 'react';
import { recordAPI } from '../services/api';
import FileViewer from './FileViewer';
import './PatientRecords.css';

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    category: 'prescription',
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await recordAPI.getMyRecords();
      setRecords(response.data.records || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch records');
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
      setFormData({ ...formData, file });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      setError('Please select a file');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('description', formData.description.trim());

      await recordAPI.uploadRecord(uploadFormData);
      
      setSuccess('Record uploaded successfully!');
      setFormData({
        file: null,
        category: 'prescription',
        title: '',
        description: ''
      });
      setShowUploadForm(false);
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      await recordAPI.deleteRecord(recordId);
      setSuccess('Record deleted successfully!');
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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

  const getCategoryBadgeClass = (category) => {
    const classes = {
      prescription: 'badge-prescription',
      report: 'badge-report'
    };
    return classes[category] || '';
  };

  if (loading) {
    return <div className="records-loading">Loading records...</div>;
  }

  return (
    <div className="patient-records">
      <div className="records-header">
        <h2>My Medical Records</h2>
        <button 
          className="btn-upload" 
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : '+ Upload Record'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showUploadForm && (
        <div className="upload-form-container">
          <form onSubmit={handleSubmit} className="upload-form">
            <h3>Upload Medical Record</h3>
            
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Blood Test Report - Jan 2024"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description..."
                rows="3"
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
              {formData.file && (
                <div className="file-info">
                  Selected: {formData.file.name} ({formatFileSize(formData.file.size)})
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowUploadForm(false);
                  setFormData({
                    file: null,
                    category: 'prescription',
                    title: '',
                    description: ''
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

      <div className="records-list">
        {records.length === 0 ? (
          <div className="empty-records">
            <p>No medical records found. Upload your first record to get started.</p>
          </div>
        ) : (
          <div className="records-grid">
            {records.map((record) => (
              <div key={record._id} className="record-card">
                <div className="record-header">
                  <span className={`category-badge ${getCategoryBadgeClass(record.category)}`}>
                    {record.category.charAt(0).toUpperCase() + record.category.slice(1)}
                  </span>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(record._id)}
                    title="Delete record"
                  >
                    ×
                  </button>
                </div>
                
                {record.createdBy === 'doctor' && record.doctorId && (
                  <div className="doctor-upload-badge">
                    👨‍⚕️ Uploaded by Dr. {record.doctorId.name}
                    {record.doctorId.specialization && (
                      <span className="doctor-specialization"> ({record.doctorId.specialization})</span>
                    )}
                  </div>
                )}
                
                <h3 className="record-title">{record.title}</h3>
                
                {record.description && (
                  <p className="record-description">{record.description}</p>
                )}

                {record.prescription && (
                  <div className="record-update">
                    <strong>Prescription:</strong>
                    <p>{record.prescription}</p>
                    {record.lastUpdatedBy && (
                      <small>Updated by Dr. {record.lastUpdatedBy.name}</small>
                    )}
                  </div>
                )}

                {record.diagnosis && (
                  <div className="record-update">
                    <strong>Diagnosis:</strong>
                    <p>{record.diagnosis}</p>
                    {record.lastUpdatedBy && (
                      <small>Updated by Dr. {record.lastUpdatedBy.name}</small>
                    )}
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
                  {record.updatedAt !== record.createdAt && (
                    <div className="record-date">
                      Updated: {formatDate(record.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default PatientRecords;
