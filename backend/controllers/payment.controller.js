const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Booking = require('../models/Booking');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking details
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this booking'
      });
    }

    // Check if already paid
    if (booking.payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already paid'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(booking.pricing.totalAmount * 100), // Amount in paise
      currency: booking.pricing.currency || 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
        userId: req.user.id,
        turfId: booking.turf.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update booking with order ID
    booking.payment.razorpayOrderId = razorpayOrder.id;
    booking.payment.status = 'processing';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        bookingId: bookingId
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingId
    } = req.body;

    // Create signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // Verify signature
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Get booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking payment details
    booking.payment.status = 'completed';
    booking.payment.razorpayPaymentId = razorpayPaymentId;
    booking.payment.razorpaySignature = razorpaySignature;
    booking.payment.paidAt = new Date();
    booking.payment.transactionId = razorpayPaymentId;
    booking.bookingStatus = 'confirmed';

    await booking.save();

    await booking.populate('turf', 'name location contactInfo');

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: booking
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Private
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { bookingId, error } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking payment status
    booking.payment.status = 'failed';
    booking.notes = `Payment failed: ${error || 'Unknown error'}`;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded',
      data: booking
    });
  } catch (error) {
    console.error('Handle payment failure error:', error);
    res.status(500).json({
      success: false,
      message: 'Error handling payment failure',
      error: error.message
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:bookingId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('user', 'name email phone')
      .populate('turf', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view payment details'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id,
        payment: booking.payment,
        pricing: booking.pricing,
        bookingStatus: booking.bookingStatus
      }
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private (Admin)
exports.processRefund = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!booking.cancellation.refundEligible) {
      return res.status(400).json({
        success: false,
        message: 'Booking is not eligible for refund'
      });
    }

    if (booking.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed for this booking'
      });
    }

    // Process refund through Razorpay
    const refundAmount = booking.payment.refundAmount;
    
    // In production, you would call Razorpay refund API here
    // const refund = await razorpay.payments.refund(booking.payment.razorpayPaymentId, {
    //   amount: refundAmount * 100, // Amount in paise
    //   notes: {
    //     reason: booking.cancellation.reason
    //   }
    // });

    // Update booking
    booking.payment.status = 'refunded';
    booking.payment.refundedAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        bookingId: booking._id,
        refundAmount,
        refundedAt: booking.payment.refundedAt
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payments/razorpay-key
// @access  Public
exports.getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
};
