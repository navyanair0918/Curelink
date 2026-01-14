import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('patient');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'patient');
    fetchAppointments(user.role || 'patient');
  }, []);

  
  const fetchAppointments = async (role) => {
    try {
      const endpoint = role === 'doctor' ? '/appointments/doctor' : '/appointments/patient';
      const response = await API.get(endpoint);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching appointments';
      setMessage(errorMessage);
      console.error('Error:', error.response?.data || error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="my-appointments">
      <h2>My Appointments</h2>
      {message && <div className="error-message">{message}</div>}

      {appointments.length === 0 ? (
        <div className="no-appointments">No appointments found</div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>
                  {userRole === 'doctor' 
                    ? appointment.patientId?.name || 'Unknown Patient'
                    : `Dr. ${appointment.doctorId?.name || 'Unknown Doctor'}`
                  }
                </h3>
                <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-details">
                <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                <p><strong>Time:</strong> {appointment.timeSlot}</p>
                {userRole === 'doctor' ? (
                  <>
                    <p><strong>Patient Email:</strong> {appointment.patientId?.email || 'N/A'}</p>
                    {appointment.doctorId?.specialization && (
                      <p><strong>Specialization:</strong> {appointment.doctorId.specialization}</p>
                    )}
                  </>
                ) : (
                  <p><strong>Doctor Email:</strong> {appointment.doctorId?.email || 'N/A'}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
