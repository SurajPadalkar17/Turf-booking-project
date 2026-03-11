import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/turfs');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Book Your Game,<br />
              <span className="gradient-text">Anytime, Anywhere</span>
            </h1>
            <p className="hero-subtitle">
              Find and book the best sports turfs in your city. Football, Cricket, 
              Badminton and more - all in one place.
            </p>
            <div className="hero-cta">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                <FiSearch /> Find Turfs Near You
              </button>
              <Link to="/register" className="btn btn-outline btn-lg">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title text-center">Why Choose TurfBook?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiMapPin />
              </div>
              <h3>Location-Based Search</h3>
              <p>Find turfs near you with our smart location-based search. See exactly how far each venue is from your location.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiClock />
              </div>
              <h3>Real-Time Availability</h3>
              <p>Check live slot availability and book instantly. No more phone calls or waiting for confirmations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment processing through Razorpay. Get instant booking confirmation via SMS and email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Play?</h2>
            <p>Join thousands of players who book their favorite turfs with TurfBook</p>
            <button onClick={handleGetStarted} className="btn btn-secondary btn-lg">
              Start Booking Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
