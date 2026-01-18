import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/dashboard.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch patient appointments
      const response = await API.get('/appointments/patient');
      const appointments = response.data.appointments || [];
      
      // Generate notifications based on appointment times
      const generatedNotifications = generateNotifications(appointments);
      setNotifications(generatedNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (appointments) => {
    const now = new Date();
    const notificationsList = [];

    appointments.forEach(appointment => {
      // Skip completed or cancelled appointments
      if (appointment.status === 'Completed' || appointment.status === 'Cancelled') {
        return;
      }

      const appointmentDate = new Date(appointment.date);
      const timeSlot = appointment.timeSlot || '';
      
      // Parse time slot (e.g., "10:00 AM")
      let appointmentTime = parseTimeSlot(timeSlot);
      
      // Combine date and time
      const appointmentDateTime = new Date(appointmentDate);
      if (appointmentTime) {
        appointmentDateTime.setHours(appointmentTime.hours, appointmentTime.minutes, 0, 0);
      } else {
        // Default to 9 AM if time slot can't be parsed
        appointmentDateTime.setHours(9, 0, 0, 0);
      }

      const timeDiff = appointmentDateTime - now;
      const hoursUntil = timeDiff / (1000 * 60 * 60);
      const daysUntil = hoursUntil / 24;

      const doctorName = appointment.doctorId?.name || 'Doctor';

      // Calculate if appointment is tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const appointmentDay = new Date(appointmentDate);
      appointmentDay.setHours(0, 0, 0, 0);
      
      const isAppointmentTomorrow = appointmentDay.getTime() === tomorrow.getTime();
      const isAppointmentLater = appointmentDay.getTime() > tomorrow.getTime();

      // 8 PM reminder the night before appointment
      // Show reminder if:
      // - Appointment is tomorrow
      // - Current time is after 8:00 PM (20:00) on the day before
      // - And we're still more than 3 hours away (to avoid overlapping with 2-3hr reminder)
      const currentHour = now.getHours();
      const isAfter8PM = currentHour >= 20;
      
      // Show reminder after 8 PM on the night before (when appointment is tomorrow)
      // Keep it visible until we get to the 2-3 hour reminder window or until midnight
      if (isAppointmentTomorrow && isAfter8PM && hoursUntil > 3 && hoursUntil < 18) {
        notificationsList.push({
          id: `night-before-${appointment._id}`,
          type: 'reminder',
          priority: 'medium',
          message: `Reminder: You have an appointment with Dr. ${doctorName} tomorrow at ${timeSlot}. Don't forget!`,
          appointmentId: appointment._id,
          timestamp: now,
          icon: '🌙'
        });
      }

      // 2-3 hours before notification
      if (hoursUntil >= 2 && hoursUntil <= 3) {
        const hoursRounded = Math.floor(hoursUntil);
        notificationsList.push({
          id: `2-3hr-before-${appointment._id}`,
          type: 'reminder',
          priority: 'high',
          message: `Reminder: You have an appointment with Dr. ${doctorName} in ${hoursRounded} hours at ${timeSlot}`,
          appointmentId: appointment._id,
          timestamp: now,
          icon: '⏰'
        });
      }

      // Within 2 hours notification (urgent reminder)
      if (hoursUntil > 0 && hoursUntil < 2) {
        const minutesUntil = Math.floor(hoursUntil * 60);
        notificationsList.push({
          id: `soon-${appointment._id}`,
          type: 'reminder',
          priority: 'high',
          message: `Upcoming: Your appointment with Dr. ${doctorName} is in ${minutesUntil} minutes`,
          appointmentId: appointment._id,
          timestamp: now,
          icon: '🔔'
        });
      }

      // Appointment confirmed notification (if recently confirmed)
      if (appointment.status === 'Confirmed') {
        const updatedAt = new Date(appointment.updatedAt);
        const timeSinceUpdate = (now - updatedAt) / (1000 * 60 * 60); // hours
        
        // Show confirmation notification if appointment was confirmed within last 24 hours
        if (timeSinceUpdate < 24 && timeSinceUpdate >= 0) {
          notificationsList.push({
            id: `confirmed-${appointment._id}`,
            type: 'confirmation',
            priority: 'info',
            message: `Your appointment with Dr. ${doctorName} on ${formatDate(appointment.date)} has been confirmed`,
            appointmentId: appointment._id,
            timestamp: updatedAt,
            icon: '✅'
          });
        }
      }
    });

    // Sort notifications by priority (high -> medium -> info) and timestamp
    notificationsList.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, info: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.timestamp - a.timestamp;
    });

    return notificationsList.slice(0, 10); // Limit to 10 most recent
  };

  const parseTimeSlot = (timeSlot) => {
    if (!timeSlot) return null;
    
    // Parse formats like "10:00 AM", "2:30 PM", etc.
    const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAppointmentDate = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (appointmentDay.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }
    
    return appointmentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <aside className="notifications-panel">
        <div className="panel-head">
          <h3>Notifications</h3>
          <p className="muted">Latest alerts</p>
        </div>
        <div className="empty">Loading...</div>
      </aside>
    );
  }

  return (
    <aside className="notifications-panel">
      <div className="panel-head">
        <h3>🔔 Notifications</h3>
        <p className="muted">Latest alerts & reminders</p>
      </div>
      <div className="notes">
        {notifications.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔕</div>
            <p>No notifications</p>
            <p className="empty-hint">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(note => (
            <div key={note.id} className={`note note-${note.priority}`}>
              <div className="note-header">
                <span className="note-icon">{note.icon}</span>
                <span className={`note-badge badge-${note.priority}`}>
                  {note.priority}
                </span>
              </div>
              <p className="note-message">{note.message}</p>
              <div className="note-meta">{formatTime(note.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Notifications;
