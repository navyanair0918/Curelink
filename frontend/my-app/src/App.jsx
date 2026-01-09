import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./Login";
import Register from "./Register";
import BookAppointment from "./components/BookAppointment";
import MyAppointments from "./components/MyAppointments";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if trying to access admin route
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  if (isAdminRoute) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user was previously logged in
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // Called when login/register is successful
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onSuccess={handleAuthSuccess} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onSuccess={handleAuthSuccess} />
            )
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <div className="App">
                <nav className="navbar">
                  <Link to="/dashboard" style={{ textDecoration: "none", color: "white" }}>
                    <h1>CureLink - Digital Appointment and Health Record Portal</h1>
                  </Link>
                  <div className="nav-links">
                    <Link to="/book">Book Appointment</Link>
                    <Link to="/appointments">My Appointments</Link>
                    <button 
                      onClick={handleLogout}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid white",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </nav>
                <DashboardPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <div className="App">
                <nav className="navbar">
                  <Link to="/dashboard" style={{ textDecoration: "none", color: "white" }}>
                    <h1>CureLink - Digital Appointment and Health Record Portal</h1>
                  </Link>
                  <div className="nav-links">
                    <Link to="/book">Book Appointment</Link>
                    <Link to="/appointments">My Appointments</Link>
                    <button 
                      onClick={handleLogout}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid white",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </nav>
                <BookAppointment />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <div className="App">
                <nav className="navbar">
                  <Link to="/dashboard" style={{ textDecoration: "none", color: "white" }}>
                    <h1>CureLink - Digital Appointment and Health Record Portal</h1>
                  </Link>
                  <div className="nav-links">
                    <Link to="/book">Book Appointment</Link>
                    <Link to="/appointments">My Appointments</Link>
                    <button 
                      onClick={handleLogout}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid white",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </nav>
                <MyAppointments />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <div className="App">
                <nav className="navbar">
                  <Link to="/admin/dashboard" style={{ textDecoration: "none", color: "white" }}>
                    <h1>CureLink - Admin Dashboard</h1>
                  </Link>
                  <div className="nav-links">
                    <button 
                      onClick={handleLogout}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid white",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </nav>
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <div className="App">
                <nav className="navbar">
                  <Link to="/admin/dashboard" style={{ textDecoration: "none", color: "white" }}>
                    <h1>CureLink - Admin Dashboard</h1>
                  </Link>
                  <div className="nav-links">
                    <button 
                      onClick={handleLogout}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid white",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </nav>
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
