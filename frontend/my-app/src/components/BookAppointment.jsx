import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  // Fetch doctors list (assuming you have an API endpoint for this)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        // Note: You may need to create a GET /api/users/doctors endpoint
        // For now, this is a placeholder - adjust based on your actual API
        const response = await axios.get('/api/users/doctors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        // Fallback: You can manually add some doctors for testing
        setDoctors([
          { _id: '1', name: 'Dr. John Smith' },
          { _id: '2', name: 'Dr. Sarah Johnson' },
          { _id: '3', name: 'Dr. Michael Brown' }
        ]);
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
      const response = await axios.post(
        '/api/appointments',
        {
          doctorId: selectedDoctor,
          date,
          timeSlot
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage('Appointment booked successfully!');
      // Reset form
      setSelectedDoctor('');
      setDate('');
      setTimeSlot('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error booking appointment';
      setMessage(errorMessage);
      console.error('Booking error:', error.response?.data || error);
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
                {doctor.name}
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
