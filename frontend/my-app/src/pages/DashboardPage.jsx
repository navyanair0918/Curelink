import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Notifications from "../components/Notifications";
import DoctorDashboard from "../components/DoctorDashboard";
import DoctorProfileModal from "../components/DoctorProfileModal";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    // Don't show profile modal on login - only on registration
    setLoading(false);
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
              <p className="muted">Manage your patient appointments</p>
            </div>
          </header>
          <DoctorDashboard />
        </div>
      </div>
    );
  }

  // Show patient dashboard for patients
  const userId = "USER_ID_FROM_MONGODB";
  return (
    <div className="dashboard-page">
      <div className="dl-container">
        <header className="dl-header">
          <div>
            <h1>Welcome Back</h1>
            <p className="muted">Here's your timeline and recent activity</p>
          </div>
          <div className="dl-actions">
            <button className="btn-primary" onClick={() => navigate("/book")}>
              New Appointment
            </button>
          </div>
        </header>

        <div className="dl-grid">
          <main className="dl-main">
            <Dashboard userId={userId} />
          </main>
          <aside className="dl-aside">
            <Notifications userId={userId} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
