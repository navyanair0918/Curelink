import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminAPI } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchAllUsers();
    } else if (activeTab === "patients") {
      fetchPatients();
    } else if (activeTab === "doctors") {
      fetchDoctors();
    } else if (activeTab === "appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      setError("Failed to load statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data);
        setPatients(response.data.patients.data);
        setDoctors(response.data.doctors.data);
      }
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await adminAPI.getAllPatients();
      if (response.data.success) {
        setPatients(response.data.patients);
      }
    } catch (err) {
      setError("Failed to load patients");
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getAllDoctors();
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (err) {
      setError("Failed to load doctors");
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await adminAPI.getAllAppointments();
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (err) {
      setError("Failed to load appointments");
      console.error(err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all users, doctors, patients, and appointments</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          All Users
        </button>
        <button
          className={activeTab === "patients" ? "active" : ""}
          onClick={() => setActiveTab("patients")}
        >
          Patients ({stats?.users.patients || 0})
        </button>
        <button
          className={activeTab === "doctors" ? "active" : ""}
          onClick={() => setActiveTab("doctors")}
        >
          Doctors ({stats?.users.doctors || 0})
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments ({stats?.appointments.total || 0})
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === "stats" && stats && (
          <div className="stats-grid">
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3>Total Users</h3>
              <p className="stat-number">{stats.users.total}</p>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3>Patients</h3>
              <p className="stat-number">{stats.users.patients}</p>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Doctors</h3>
              <p className="stat-number">{stats.users.doctors}</p>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>Total Appointments</h3>
              <p className="stat-number">{stats.appointments.total}</p>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Pending</h3>
              <p className="stat-number">{stats.appointments.pending}</p>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3>Confirmed</h3>
              <p className="stat-number">{stats.appointments.confirmed}</p>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3>Completed</h3>
              <p className="stat-number">{stats.appointments.completed}</p>
            </motion.div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <div className="users-grid">
              <div className="users-column">
                <h2>Patients ({users?.patients.count || 0})</h2>
                <div className="users-list">
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <div key={patient._id} className="user-card">
                        <div className="user-info">
                          <h4>{patient.name}</h4>
                          <p>{patient.email}</p>
                          <span className="user-role patient">Patient</span>
                        </div>
                        <div className="user-meta">
                          <p>Joined: {new Date(patient.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No patients found</p>
                  )}
                </div>
              </div>

              <div className="users-column">
                <h2>Doctors ({users?.doctors.count || 0})</h2>
                <div className="users-list">
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <div key={doctor._id} className="user-card">
                        <div className="user-info">
                          <h4>{doctor.name}</h4>
                          <p>{doctor.email}</p>
                          <span className="user-role doctor">Doctor</span>
                        </div>
                        <div className="user-meta">
                          <p>Joined: {new Date(doctor.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No doctors found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div className="table-section">
            <h2>All Patients</h2>
            <div className="users-list">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <div key={patient._id} className="user-card">
                    <div className="user-info">
                      <h4>{patient.name}</h4>
                      <p>{patient.email}</p>
                      <span className="user-role patient">Patient</span>
                    </div>
                    <div className="user-meta">
                      <p>ID: {patient._id}</p>
                      <p>Joined: {new Date(patient.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No patients found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "doctors" && (
          <div className="table-section">
            <h2>All Doctors</h2>
            <div className="users-list">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div key={doctor._id} className="user-card">
                    <div className="user-info">
                      <h4>{doctor.name}</h4>
                      <p>{doctor.email}</p>
                      <span className="user-role doctor">Doctor</span>
                    </div>
                    <div className="user-meta">
                      <p>ID: {doctor._id}</p>
                      <p>Joined: {new Date(doctor.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No doctors found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="table-section">
            <h2>All Appointments</h2>
            <div className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <div className="appointment-info">
                      <h4>
                        {appointment.patientId?.name || "Unknown"} →{" "}
                        {appointment.doctorId?.name || "Unknown"}
                      </h4>
                      <p>
                        <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong> {appointment.timeSlot}
                      </p>
                      <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="appointment-meta">
                      <p>
                        <strong>Patient:</strong> {appointment.patientId?.email || "N/A"}
                      </p>
                      <p>
                        <strong>Doctor:</strong> {appointment.doctorId?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No appointments found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
