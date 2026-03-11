const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getAllBookings
} = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  bookingValidation,
  mongoIdValidation,
  validate
} = require('../middleware/validation.middleware');

// Protected routes
router.post('/', protect, bookingValidation, validate, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, mongoIdValidation, validate, getBookingById);
router.put('/:id/cancel', protect, mongoIdValidation, validate, cancelBooking);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin'), mongoIdValidation, validate, updateBookingStatus);

module.exports = router;
