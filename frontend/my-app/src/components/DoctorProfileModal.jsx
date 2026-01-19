import React, { useState } from 'react';
import { userAPI } from '../services/api';
import './DoctorProfileModal.css';

const DoctorProfileModal = ({ onComplete, doctorInfo }) => {
  const [degree, setDegree] = useState(doctorInfo?.degree || '');
  const [specialization, setSpecialization] = useState(doctorInfo?.specialization || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const specializations = [
    'General Physician',
    'Cardiologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Neurologist',
    'Dermatologist',
    'ENT Specialist',
    'Gynecologist',
    'Psychiatrist',
    'Ophthalmologist',
    'Gastroenterologist',
    'Pulmonologist',
    'Endocrinologist',
    'Urologist',
    'Oncologist'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!degree.trim()) 
    {
      setError('Please enter your qualification/degree');
      return;
    }

    if (!specialization.trim()) 
    {
      setError('Please select your specialization');
      return;
    }

    setLoading(true);
    try 
    {
      const response = await userAPI.updateProfile({
        degree: degree.trim(),
        specialization: specialization.trim()
      });

      if (response.data.success) 
      {
        onComplete({
          degree: degree.trim(),
          specialization: specialization.trim()
        });
      }
    } 
    catch (err) 
    {
      const errorMsg = err.response?.data?.message || 'Error updating profile';
      setError(errorMsg);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-profile-modal-overlay">
      <div className="doctor-profile-modal">
        <div className="modal-header">
          <h2>Complete Your Profile</h2>
          <p>Please provide your medical qualifications and specialization</p>
        </div>

        {error && (
          <div className="modal-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="degree">Qualification/Degree *</label>
            <input
              id="degree"
              type="text"
              placeholder="e.g., MBBS, MD or MBBS, MS"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              required
            />
            <small>Enter your medical degrees (e.g., MBBS, MD, MS, etc.)</small>
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization *</label>
            <select
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            >
              <option value="">Select your specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <small>Select your area of medical specialization</small>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
