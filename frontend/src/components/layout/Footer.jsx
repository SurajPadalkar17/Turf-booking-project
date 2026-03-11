import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">⚽ TurfBook</h3>
            <p>Book Your Game, Anytime, Anywhere</p>
            <p className="footer-tagline">
              India's leading platform for turf booking. Find and book sports facilities near you.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/turfs">Find Turfs</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FiMail />
                <a href="mailto:support@turfbook.com">support@turfbook.com</a>
              </li>
              <li>
                <FiPhone />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <FiMapPin />
                <span>Nagpur, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TurfBook. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
