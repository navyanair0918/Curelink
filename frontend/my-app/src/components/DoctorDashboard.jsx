import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await API.get('/appointments/doctor');
      setAppointments(response.data.appointments || []);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error fetching appointments';
      setMessage(errorMsg);
      console.error('Error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      const response = await API.put(`/appointments/${appointmentId}`, { status: newStatus });
      setMessage('Appointment status updated successfully');
      // Refresh appointments
      await fetchAppointments();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error updating appointment status';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setUpdatingId(null);
      setSelectedStatus(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return '#10b981';
      case 'Completed':
        return '#667eea';
      default:
        return '#f59e0b';
    }
  };

  // Filter appointments by status
  const filteredAppointments = selectedStatus
    ? appointments.filter(apt => apt.status === selectedStatus)
    : appointments;

  if (loading) {
    return <div className="doctor-dashboard-loading">Loading appointments...</div>;
  }

  return (
    <div className="doctor-dashboard">
      <div className="doctor-dashboard-header">
        <h1>My Appointments</h1>
        <p>View and manage patient appointments</p>
      </div>

      {message && (
        <div className={`doctor-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Status Filter */}
      <div className="status-filters">
        <button
          className={selectedStatus === null ? 'active' : ''}
          onClick={() => setSelectedStatus(null)}
        >
          All ({appointments.length})
        </button>
        <button
          className={selectedStatus === 'Pending' ? 'active' : ''}
          onClick={() => setSelectedStatus('Pending')}
        >
          Pending ({appointments.filter(a => a.status === 'Pending').length})
        </button>
        <button
          className={selectedStatus === 'Confirmed' ? 'active' : ''}
          onClick={() => setSelectedStatus('Confirmed')}
        >
          Confirmed ({appointments.filter(a => a.status === 'Confirmed').length})
        </button>
        <button
          className={selectedStatus === 'Completed' ? 'active' : ''}
          onClick={() => setSelectedStatus('Completed')}
        >
          Completed ({appointments.filter(a => a.status === 'Completed').length})
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="no-appointments">
          {selectedStatus 
            ? `No ${selectedStatus.toLowerCase()} appointments found`
            : 'No appointments found'}
        </div>
      ) : (
        <div className="appointments-grid">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="doctor-appointment-card">
              <div className="appointment-header">
                <div>
                  <h3>{appointment.patientId?.name || 'Unknown Patient'}</h3>
                  <p className="patient-email">{appointment.patientId?.email || 'N/A'}</p>
                </div>
                <span 
                  className={`status-badge ${getStatusClass(appointment.status)}`}
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  {appointment.status}
                </span>
              </div>
              
              <div className="appointment-details">
                <div className="detail-item">
                  <strong>📅 Date:</strong>
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="detail-item">
                  <strong>🕐 Time:</strong>
                  <span>{appointment.timeSlot}</span>
                </div>
                <div className="detail-item">
                  <strong>📧 Patient Email:</strong>
                  <span>{appointment.patientId?.email || 'N/A'}</span>
                </div>
              </div>

              {appointment.status !== 'Completed' && (
                <div className="appointment-actions">
                  {appointment.status === 'Pending' && (
                    <button
                      className="btn-confirm"
                      onClick={() => updateAppointmentStatus(appointment._id, 'Confirmed')}
                      disabled={updatingId === appointment._id}
                    >
                      {updatingId === appointment._id ? 'Updating...' : 'Confirm Appointment'}
                    </button>
                  )}
                  {appointment.status === 'Confirmed' && (
                    <button
                      className="btn-complete"
                      onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                      disabled={updatingId === appointment._id}
                    >
                      {updatingId === appointment._id ? 'Updating...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
