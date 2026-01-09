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
    <div className="dashboard">
      <h2>My Appointments</h2>
      {appointments.map(app => (
        <div className="card" key={app._id}>
          <p><b>Date:</b> {app.date}</p>
          <p><b>Time:</b> {app.time}</p>
          <p><b>Status:</b> {app.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
