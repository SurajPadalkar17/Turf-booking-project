import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiMapPin, FiCalendar, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚽</span>
          <span className="brand-name">TurfBook</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <Link to="/turfs" className="nav-link">
            <FiMapPin /> Find Turfs
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className="nav-link">
              <FiCalendar /> My Bookings
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-button">
                <FiUser />
                <span>{user?.name}</span>
              </button>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/turfs" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiMapPin /> Find Turfs
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <FiCalendar /> My Bookings
            </Link>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
