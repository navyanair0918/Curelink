import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/dashboard.css";

const Dashboard = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get(`/dashboard/${userId}`)
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <h2>My Appointments</h2>
        <p className="muted">Upcoming and recent appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="empty">No appointments to show.</div>
      ) : (
        <div className="cards-grid">
          {appointments.map(app => (
            <article className="card" key={app._id}>
              <div className="card-row">
                <div className="card-date">{app.date}</div>
                <div className={`pill ${app.status?.toLowerCase()}`}>{app.status}</div>
              </div>
              <div className="card-time">{app.time}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
