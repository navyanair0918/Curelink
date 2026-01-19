import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    // To refresh appointments every minute
    const interval = setInterval(fetchAppointments, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try 
    {
      setLoading(true);
      const response = await API.get('/appointments/patient');
      const fetchedAppointments = response.data.appointments || [];
      
      const formattedAppointments = fetchedAppointments.map(app => ({
        ...app,
        formattedDate: formatDate(app.date),
        formattedTime: app.timeSlot || 'N/A',
        doctorName: app.doctorId?.name || 'Unknown Doctor'
      }));
      
      setAppointments(formattedAppointments);
    } 
    catch (err) 
    {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    } 
    finally 
    {
      setLoading(false);
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

  if (loading) 
  {
    return (
      <section className="dashboard">
        <div className="dashboard-head">
          <h2>My Appointments</h2>
          <p className="muted">Upcoming and recent appointments</p>
        </div>
        <div className="empty">Loading appointments...</div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <div>
          <h2>My Appointments</h2>
          <p className="muted">Upcoming and recent appointments</p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📅</div>
          <p>No appointments to show.</p>
          <p className="empty-hint">Book your first appointment to get started!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {appointments.map(app => (
            <article className="card" key={app._id}>
              <div className="card-row">
                <div className="card-date">{app.formattedDate}</div>
                <div className={`pill ${app.status?.toLowerCase()}`}>{app.status}</div>
              </div>
              <div className="card-time">🕐 {app.formattedTime}</div>
              <div className="card-doctor">👨‍⚕️ Dr. {app.doctorName}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
