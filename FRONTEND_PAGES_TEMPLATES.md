# Frontend Pages Templates

Create these files in `frontend/src/pages/` directory:

## LoginPage.jsx
```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/turfs');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h1>Welcome Back</h1>
          <p>Login to continue booking turfs</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

## RegisterPage.jsx
```jsx
// Similar structure to LoginPage with name, email, phone, password fields

## TurfListPage.jsx
```jsx
// Display list of turfs with filters, search, and location-based results
// Use turfService.getAllTurfs() and turfService.getNearbyTurfs()

## TurfDetailPage.jsx
```jsx
// Show turf details, images, amenities, reviews, and available slots
// Use turfService.getTurfById() and turfService.getAvailableSlots()

## BookingPage.jsx
```jsx
// Booking form with date selection, time slot selection, and payment
// Use bookingService.createBooking() and paymentService.processPayment()

## MyBookingsPage.jsx
```jsx
// Display user's bookings with filters and cancel option
// Use bookingService.getMyBookings() and bookingService.cancelBooking()
```

Add corresponding CSS files for each page with styling similar to HomePage.css
