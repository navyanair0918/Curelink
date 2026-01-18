import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Notifications from "../components/Notifications";
import DoctorDashboard from "../components/DoctorDashboard";
import DoctorProfileModal from "../components/DoctorProfileModal";
import PatientRecords from "../components/PatientRecords";
import DoctorRecordUpdate from "../components/DoctorRecordUpdate";
import DoctorAvailability from "../components/DoctorAvailability";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    // Don't show profile modal on login - only on registration
    setLoading(false);

    // Listen for switch to records event from navbar
    const handleSwitchToRecords = () => {
      setActiveTab("records");
    };
    window.addEventListener('switchToRecords', handleSwitchToRecords);
    return () => window.removeEventListener('switchToRecords', handleSwitchToRecords);
  }, []);

  const handleProfileComplete = (profileData) => {
    // Update user in localStorage
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowProfileModal(false);
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  // Show doctor dashboard for doctors
  if (user?.role === "doctor") {
    return (
      <div className="dashboard-page">
        {showProfileModal && (
          <DoctorProfileModal
            onComplete={handleProfileComplete}
            doctorInfo={user}
          />
        )}
        <div className="dl-container">
          <header className="dl-header">
            <div>
              <h1>Welcome Back, Dr. {user?.name || "Doctor"}</h1>
              <p className="muted">Manage your patient appointments and records</p>
            </div>
          </header>
          
          {/* Tab Navigation */}
          <div className="doctor-tabs">
            <button
              className={activeTab === "appointments" ? "active" : ""}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </button>
            <button
              className={activeTab === "availability" ? "active" : ""}
              onClick={() => setActiveTab("availability")}
            >
              Manage Availability
            </button>
            <button
              className={activeTab === "records" ? "active" : ""}
              onClick={() => setActiveTab("records")}
            >
              Patient Records
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "appointments" && <DoctorDashboard />}
          {activeTab === "availability" && <DoctorAvailability />}
          {activeTab === "records" && <DoctorRecordUpdate />}
        </div>
      </div>
    );
  }

  // Show patient dashboard for patients
  return (
    <div className="dashboard-page">
      <div className="dl-container">
        <header className="dl-header">
          <div>
            <h1>Welcome Back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
            <p className="muted">Here's your timeline and recent activity</p>
          </div>
          <div className="dl-actions">
            <button className="btn-primary" onClick={() => navigate("/book")}>
              <span style={{ marginRight: '6px' }}>📅</span>
              New Appointment
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="patient-tabs">
          <button
            className={activeTab === "appointments" ? "active" : ""}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
          <button
            className={activeTab === "records" ? "active" : ""}
            onClick={() => setActiveTab("records")}
          >
            Medical Records
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "appointments" && (
          <div className="dl-grid">
            <main className="dl-main">
              <Dashboard />
            </main>
            <aside className="dl-aside">
              <Notifications />
            </aside>
          </div>
        )}
        {activeTab === "records" && (
          <PatientRecords />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
