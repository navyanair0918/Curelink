import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DoctorNavbar.css';

const DoctorNavbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="doctor-navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-link">

          <h1>CureLink</h1>
        </Link>
      </div>
      
      <div className="navbar-menu">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >

          Dashboard
        </Link>
        <Link 
          to="/appointments"
          className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
        >
          My Appointments
        </Link>
      </div>

      <div className="navbar-actions">
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
