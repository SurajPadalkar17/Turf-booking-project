const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      turfId,
      bookingDate,
      timeSlot,
      duration,
      customerDetails,
      specialRequests
    } = req.body;

    // Check if turf exists
    const turf = await Turf.findById(turfId);

    if (!turf || !turf.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found or inactive'
      });
    }

    // Check if slot is available
    const isAvailable = await Booking.isSlotAvailable(
      turfId,
      new Date(bookingDate),
      timeSlot.startTime,
      timeSlot.endTime
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Check if booking date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book for past dates'
      });
    }

    // Check advance booking limit
    const maxAdvanceDays = turf.features.advanceBookingDays || 30;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxAdvanceDays);

    if (selectedDate > maxDate) {
      return res.status(400).json({
        success: false,
        message: `Cannot book more than ${maxAdvanceDays} days in advance`
      });
    }

    // Calculate pricing
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const basePrice = isWeekend ? turf.pricing.weekendPrice : turf.pricing.weekdayPrice;
    const tax = basePrice * 0.18; // 18% GST
    const totalAmount = basePrice + tax;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      turf: turfId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      duration,
      pricing: {
        basePrice,
        tax,
        totalAmount
      },
      customerDetails: {
        ...customerDetails,
        email: customerDetails.email || req.user.email,
        phone: customerDetails.phone || req.user.phone
      },
      specialRequests: specialRequests || ''
    });

    await booking.populate('turf', 'name location images contactInfo');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sort = 'desc' } = req.query;

    const query = { user: req.user.id };
    if (status) query.bookingStatus = status;

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .populate('turf', 'name location images contactInfo pricing')
      .sort({ bookingDate: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('turf', 'name location images contactInfo pricing operatingHours')
      .populate('user', 'name email phone');

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
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);

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
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking is already cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Check if booking date has passed
    if (new Date(booking.bookingDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel past bookings'
      });
    }

    // Calculate refund
    const refundAmount = booking.calculateRefund();

    // Update booking
    booking.bookingStatus = 'cancelled';
    booking.cancellation = {
      isCancelled: true,
      cancelledAt: new Date(),
      cancelledBy: req.user.id,
      reason: reason || 'User cancellation',
      refundEligible: refundAmount > 0
    };

    if (refundAmount > 0) {
      booking.payment.refundAmount = refundAmount;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking,
        refundAmount
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.bookingStatus = status;
    if (notes) booking.notes = notes;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin/all
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { 
      status, 
      turfId, 
      startDate, 
      endDate,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};
    if (status) query.bookingStatus = status;
    if (turfId) query.turf = turfId;
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('turf', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};
