import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './PatientNavbar.css';

const PatientNavbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname.startsWith('/dashboard'));
  };

  return (
    <nav className="patient-navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-link">
          <span className="brand-icon">⚕️</span>
          <h1>CureLink</h1>
        </Link>
      </div>
      
      <div className="navbar-menu">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link 
          to="/book" 
          className={`nav-link ${isActive('/book') ? 'active' : ''}`}
        >
          <span className="nav-icon">📅</span>
          Book Appointment
        </Link>
        <Link 
          to="/appointments" 
          className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
        >
          <span className="nav-icon">📋</span>
          My Appointments
        </Link>
        <Link 
          to="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
            // Dispatch event to switch to records tab
            setTimeout(() => {
              const event = new CustomEvent('switchToRecords');
              window.dispatchEvent(event);
            }, 100);
          }}
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <span className="nav-icon">📁</span>
          Medical Records
        </Link>
      </div>

      <div className="navbar-actions">
        <button onClick={onLogout} className="btn-logout">
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default PatientNavbar;
