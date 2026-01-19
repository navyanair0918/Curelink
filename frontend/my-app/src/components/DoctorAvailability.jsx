import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './DoctorAvailability.css';

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [actionType, setActionType] = useState('date'); 

  const allTimeSlots = 
  [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try 
    {
      setLoading(true);
      const response = await API.get('/availability');
      setAvailability(response.data.availability);
      setMessage('');
    } 
    catch (error) 
    {
      const errorMsg = error.response?.data?.message || 'Error fetching availability';
      setMessage(errorMsg);
      console.error('Error:', error.response?.data || error);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  const addUnavailableDate = async () => {
    if (!selectedDate) 
    {
      setMessage('Please select a date');
      return;
    }

    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateTime < today) 
    {
      setMessage('Cannot mark past dates as unavailable');
      return;
    }

    try 
    {
      setMessage('');
      await API.post('/availability/unavailable-date', { date: selectedDate });
      setMessage('Date marked as unavailable successfully');
      setSelectedDate('');
      await fetchAvailability();
      setTimeout(() => setMessage(''), 3000);
    } 
    catch (error) 
    {
      const errorMsg = error.response?.data?.message || 'Error marking date as unavailable';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const removeUnavailableDate = async (dateToRemove) => {
    try 
    {
      setMessage('');
      await API.delete('/availability/unavailable-date', { data: { date: dateToRemove } });
      setMessage('Date removed from unavailable dates');
      await fetchAvailability();
      setTimeout(() => setMessage(''), 3000);
    } 
    catch (error) 
    {
      const errorMsg = error.response?.data?.message || 'Error removing date';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const addUnavailableTimeSlot = async () => {
    if (!selectedDate || !selectedTimeSlot) 
    {
      setMessage('Please select both date and time slot');
      return;
    }

    const selectedDateTime = new Date(selectedDate);
    const today = new Date();

    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const todayOnly = new Date();
    todayOnly.setHours(0, 0, 0, 0);

    if (selectedDateOnly < todayOnly) 
    {
      setMessage('Cannot mark past dates as unavailable');
      return;
    }

    if (selectedDateOnly.getTime() === todayOnly.getTime()) 
      {
      const [timeStr, period] = selectedTimeSlot.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      const slotHours = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
      
      selectedDateTime.setHours(slotHours, minutes, 0, 0);
      
      if (selectedDateTime <= today) 
      {
        setMessage('Cannot mark past time slots as unavailable');
        return;
      }
    }

    try 
    {
      setMessage('');
      await API.post('/availability/unavailable-slot', { 
        date: selectedDate, 
        timeSlot: selectedTimeSlot 
      });
      setMessage('Time slot marked as unavailable successfully');
      setSelectedDate('');
      setSelectedTimeSlot('');
      await fetchAvailability();
      setTimeout(() => setMessage(''), 3000);
    } 
    catch (error) 
    {
      const errorMsg = error.response?.data?.message || 'Error marking time slot as unavailable';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const removeUnavailableTimeSlot = async (dateToRemove, timeSlotToRemove) => {
    try 
    {
      setMessage('');
      await API.delete('/availability/unavailable-slot', { 
        data: { date: dateToRemove, timeSlot: timeSlotToRemove } 
      });
      setMessage('Time slot removed from unavailable slots');
      await fetchAvailability();
      setTimeout(() => setMessage(''), 3000);
    } 
    catch (error) 
    {
      const errorMsg = error.response?.data?.message || 'Error removing time slot';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) 
  {
    return <div className="availability-loading">Loading availability...</div>;
  }

  return (
    <div className="doctor-availability">
      <div className="availability-header">
        <h2>Manage Availability</h2>
        <p>Mark dates or time slots when you're not available. Patients won't be able to book during these times.</p>
      </div>

      {message && (
        <div className={`availability-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Action Type Selection */}
      <div className="action-type-tabs">
        <button
          className={actionType === 'date' ? 'active' : ''}
          onClick={() => setActionType('date')}
        >
          Mark Entire Date Unavailable
        </button>
        <button
          className={actionType === 'slot' ? 'active' : ''}
          onClick={() => setActionType('slot')}
        >
          Mark Time Slot Unavailable
        </button>
      </div>

      {/* Add Unavailable Date/Time Slot Form */}
      <div className="add-unavailable-form">
        {actionType === 'date' ? (
          <>
            <label>Select Date to Mark Unavailable:</label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button onClick={addUnavailableDate} className="btn-add-unavailable">
              Mark Date Unavailable
            </button>
          </>
        ) : (
          <>
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <label>Select Time Slot:</label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
            >
              <option value="">Choose a time slot</option>
              {allTimeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <button onClick={addUnavailableTimeSlot} className="btn-add-unavailable">
              Mark Time Slot Unavailable
            </button>
          </>
        )}
      </div>

      {/* Unavailable Dates List */}
      {availability && availability.unavailableDates && availability.unavailableDates.length > 0 && (
        <div className="unavailable-section">
          <h3>Unavailable Dates</h3>
          <div className="unavailable-list">
            {availability.unavailableDates.map((date, index) => (
              <div key={index} className="unavailable-item">
                <span>{formatDate(date)}</span>
                <button 
                  onClick={() => removeUnavailableDate(date)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Time Slots List */}
      {availability && availability.unavailableTimeSlots && availability.unavailableTimeSlots.length > 0 && (
        <div className="unavailable-section">
          <h3>Unavailable Time Slots</h3>
          <div className="unavailable-list">
            {availability.unavailableTimeSlots.map((slot, index) => (
              <div key={index} className="unavailable-item">
                <span>{formatDate(slot.date)} - {slot.timeSlot}</span>
                <button 
                  onClick={() => removeUnavailableTimeSlot(slot.date, slot.timeSlot)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {availability && 
       (!availability.unavailableDates || availability.unavailableDates.length === 0) &&
       (!availability.unavailableTimeSlots || availability.unavailableTimeSlots.length === 0) && (
        <div className="no-unavailable">
          <p>No unavailable dates or time slots. All time slots are available for booking.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;
