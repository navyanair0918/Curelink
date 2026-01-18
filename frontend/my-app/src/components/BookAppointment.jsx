import React, { useState, useEffect, useMemo } from 'react';
import API from '../services/api';
import './BookAppointment.css';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // All available time slots
  const allTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  // Convert time slot string to 24-hour format for comparison
  const parseTimeSlot = (timeSlotStr) => {
    if (!timeSlotStr) return null;
    
    const match = timeSlotStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  };

  // Get available time slots based on selected date
  const getAvailableTimeSlots = () => {
    if (!date) {
      return allTimeSlots;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    
    // Check if selected date is today
    const isToday = 
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    if (!isToday) {
      // For future dates, show all time slots
      return allTimeSlots;
    }

    // For today, filter out past time slots
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    return allTimeSlots.filter(slot => {
      const slotTime = parseTimeSlot(slot);
      if (!slotTime) return true;

      // Compare hours first, then minutes
      if (slotTime.hours > currentHours) {
        return true;
      } else if (slotTime.hours === currentHours) {
        // Same hour, check minutes (allow slots at least 15 minutes in the future)
        return slotTime.minutes >= currentMinutes + 15;
      }
      return false;
    });
  };

  // Memoize available time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    return getAvailableTimeSlots();
  }, [date]);

  // Reset timeSlot if it's no longer available when date changes
  useEffect(() => {
    if (timeSlot && date) {
      if (!availableTimeSlots.includes(timeSlot)) {
        setTimeSlot('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]); // Only depend on date - timeSlot is intentionally excluded to avoid loops

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
          {date && availableTimeSlots.length === 0 ? (
            <div className="time-slot-message">
              <p>No available time slots for today. Please select a future date.</p>
            </div>
          ) : (
            <select
              id="timeSlot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            >
              <option value="">Choose a time</option>
              {availableTimeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          )}
          {date && availableTimeSlots.length > 0 && availableTimeSlots.length < allTimeSlots.length && (
            <p className="time-slot-hint">Only future time slots are shown for today</p>
          )}
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
