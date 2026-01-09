import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login first. No authentication token found.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        '/api/appointments/patient',
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
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
                <h3>Dr. {appointment.doctorId?.name || 'Unknown Doctor'}</h3>
                <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-details">
                <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                <p><strong>Time:</strong> {appointment.timeSlot}</p>
                <p><strong>Doctor Email:</strong> {appointment.doctorId?.email || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
