import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './BookAppointment.css';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get('/users/doctors');
        console.log('Doctors API response:', response.data);
        if (response.data.success) {
          const doctorsList = response.data.doctors || [];
          setDoctors(Array.isArray(doctorsList) ? doctorsList : []);
          if (doctorsList.length === 0) {
            setMessage('No doctors available. Please contact admin to add doctors.');
          }
        } else {
          setMessage('Failed to load doctors. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        const errorMsg = error.response?.data?.message || 'Failed to load doctors. Please try again.';
        setMessage(errorMsg);
        // Set empty array so dropdown doesn't break
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!selectedDoctor || !date || !timeSlot) {
      setMessage('Please fill all fields');
      setLoading(false);
      return;
    }

    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first. No authentication token found.');
      setLoading(false);
      return;
    }

    try {
      const response = await API.post('/appointments', {
        doctorId: selectedDoctor,
        date,
        timeSlot
      });

      setMessage('Appointment booked successfully!');
      // Reset form
      setSelectedDoctor('');
      setDate('');
      setTimeSlot('');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error booking appointment';
      const isConflict = error.response?.data?.conflict || error.response?.status === 409;
      setMessage(errorMessage);
      console.error('Booking error:', error.response?.data || error);
      
      // If conflict, highlight the error
      if (isConflict) {
        setTimeout(() => setMessage(''), 8000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="book-appointment">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="doctor">Select Doctor:</label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization || 'General'} ({doctor.degree || 'MBBS'})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeSlot">Select Time Slot:</label>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="">Choose a time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default BookAppointment;
