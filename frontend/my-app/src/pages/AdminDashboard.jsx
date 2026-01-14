import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminAPI } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load all data on initial mount
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchAllUsers(),
          fetchPatients(),
          fetchDoctors()
        ]);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === "appointments") {
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
      console.error("Error fetching stats:", err);
      setError(prev => prev || "Failed to load statistics");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data);
        setPatients(response.data.patients?.data || []);
        setDoctors(response.data.doctors?.data || []);
      }
    } catch (err) {
      console.error("Error fetching all users:", err);
      const errorMsg = err.response?.data?.message || "Failed to load users";
      setError(prev => prev || errorMsg);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await adminAPI.getAllPatients();
      if (response.data.success) {
        // API returns { success: true, count: X, patients: [...] }
        const patientsData = response.data.patients || [];
        setPatients(Array.isArray(patientsData) ? patientsData : []);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      const errorMsg = err.response?.data?.message || "Failed to load patients";
      setError(prev => prev || errorMsg);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getAllDoctors();
      if (response.data.success) {
        // API returns { success: true, count: X, doctors: [...] }
        const doctorsData = response.data.doctors || [];
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      const errorMsg = err.response?.data?.message || "Failed to load doctors";
      setError(prev => prev || errorMsg);
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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard data...</div>
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
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
        <button
          className={activeTab === "patients" ? "active" : ""}
          onClick={() => setActiveTab("patients")}
        >
          Patients ({stats?.users.patients || patients.length || 0})
        </button>
        <button
          className={activeTab === "doctors" ? "active" : ""}
          onClick={() => setActiveTab("doctors")}
        >
          Doctors ({stats?.users.doctors || doctors.length || 0})
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

        {activeTab === "overview" && (
          <div className="overview-section">
            <h2 className="overview-title">Patients & Doctors Overview</h2>
            <div className="users-grid">
              <div className="users-column">
                <h2>All Patients ({patients.length})</h2>
                <div className="users-list">
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <div key={patient._id} className="user-card">
                        <div className="user-info">
                          <h4>{patient.name}</h4>
                          <p><strong>Email:</strong> {patient.email}</p>
                          <p><strong>User ID:</strong> {patient._id}</p>
                          <span className="user-role patient">Patient</span>
                        </div>
                        <div className="user-meta">
                          <p><strong>Joined:</strong> {new Date(patient.createdAt).toLocaleDateString()}</p>
                          <p><strong>Account Created:</strong> {new Date(patient.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No patients found</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="users-column">
                <h2>All Doctors ({doctors.length})</h2>
                <div className="users-list">
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <div key={doctor._id} className="user-card">
                        <div className="user-info">
                          <h4>{doctor.name}</h4>
                          <p><strong>Email:</strong> {doctor.email}</p>
                          {doctor.degree && <p><strong>Degree:</strong> {doctor.degree}</p>}
                          {doctor.specialization && <p><strong>Specialization:</strong> {doctor.specialization}</p>}
                          <p><strong>User ID:</strong> {doctor._id}</p>
                          <span className="user-role doctor">Doctor</span>
                        </div>
                        <div className="user-meta">
                          <p><strong>Joined:</strong> {new Date(doctor.createdAt).toLocaleDateString()}</p>
                          <p><strong>Account Created:</strong> {new Date(doctor.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No doctors found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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


        {activeTab === "patients" && (
          <div className="table-section">
            <h2>All Patients ({patients.length})</h2>
            <div className="users-list">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <div key={patient._id} className="user-card">
                    <div className="user-info">
                      <h4>{patient.name}</h4>
                      <p><strong>Email:</strong> {patient.email}</p>
                      <p><strong>User ID:</strong> {patient._id}</p>
                      <span className="user-role patient">Patient</span>
                    </div>
                    <div className="user-meta">
                      <p><strong>Joined:</strong> {new Date(patient.createdAt).toLocaleDateString()}</p>
                      <p><strong>Account Created:</strong> {new Date(patient.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No patients found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "doctors" && (
          <div className="table-section">
            <h2>All Doctors ({doctors.length})</h2>
            <div className="users-list">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div key={doctor._id} className="user-card">
                    <div className="user-info">
                      <h4>{doctor.name}</h4>
                      <p><strong>Email:</strong> {doctor.email}</p>
                      {doctor.degree && <p><strong>Degree:</strong> {doctor.degree}</p>}
                      {doctor.specialization && <p><strong>Specialization:</strong> {doctor.specialization}</p>}
                      <p><strong>User ID:</strong> {doctor._id}</p>
                      <span className="user-role doctor">Doctor</span>
                    </div>
                    <div className="user-meta">
                      <p><strong>Joined:</strong> {new Date(doctor.createdAt).toLocaleDateString()}</p>
                      <p><strong>Account Created:</strong> {new Date(doctor.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No doctors found</p>
                </div>
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
