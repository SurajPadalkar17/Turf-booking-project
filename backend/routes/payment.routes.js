const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentDetails,
  processRefund,
  getRazorpayKey
} = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public route
router.get('/razorpay-key', getRazorpayKey);

// Protected routes
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/failure', protect, handlePaymentFailure);
router.get('/:bookingId', protect, getPaymentDetails);

// Admin route
router.post('/refund', protect, authorize('admin'), processRefund);

module.exports = router;
