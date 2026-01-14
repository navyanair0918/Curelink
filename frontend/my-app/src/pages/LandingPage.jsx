import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <h1 className="logo">CureLink</h1>
          <div className="nav-buttons">
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
            <Link to="/register" className="nav-btn register-btn">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="main-heading">
            CureLink - Digital Appointment and Health Record Portal
          </h1>
          <p className="hero-subtitle">
            Your trusted platform for seamless healthcare management. Book appointments, 
            manage your health records, and connect with healthcare professionals all in one place.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-btn secondary">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="feature-icon">📅</div>
            <h3>Easy Appointments</h3>
            <p>Book and manage your medical appointments with ease</p>
          </motion.div>
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="feature-icon">📋</div>
            <h3>Health Records</h3>
            <p>Access and manage your digital health records securely</p>
          </motion.div>
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your health data is protected with industry-standard security</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 CureLink. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
