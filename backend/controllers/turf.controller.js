const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

// @desc    Get all turfs with filters
// @route   GET /api/turfs
// @access  Public
exports.getAllTurfs = async (req, res) => {
  try {
    const { 
      city, 
      sport, 
      minPrice, 
      maxPrice, 
      turfType,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (city) query['location.city'] = new RegExp(city, 'i');
    if (sport) query.sports = sport;
    if (turfType) query.turfType = turfType;
    if (minPrice || maxPrice) {
      query['pricing.weekdayPrice'] = {};
      if (minPrice) query['pricing.weekdayPrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.weekdayPrice'].$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const turfs = await Turf.find(query)
      .populate('owner', 'name email phone')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Turf.countDocuments(query);

    res.status(200).json({
      success: true,
      data: turfs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get turfs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching turfs',
      error: error.message
    });
  }
};

// @desc    Get nearby turfs based on location
// @route   GET /api/turfs/nearby
// @access  Public
exports.getNearbyTurfs = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000, limit = 20 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const turfs = await Turf.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: Number(radius)
        }
      },
      isActive: true
    })
    .populate('owner', 'name email phone')
    .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: turfs,
      count: turfs.length,
      searchParams: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: Number(radius)
      }
    });
  } catch (error) {
    console.error('Get nearby turfs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby turfs',
      error: error.message
    });
  }
};

// @desc    Get single turf by ID
// @route   GET /api/turfs/:id
// @access  Public
exports.getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('reviews.user', 'name profileImage');

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    res.status(200).json({
      success: true,
      data: turf
    });
  } catch (error) {
    console.error('Get turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching turf',
      error: error.message
    });
  }
};

// @desc    Create new turf
// @route   POST /api/turfs
// @access  Private (Admin only)
exports.createTurf = async (req, res) => {
  try {
    const turfData = {
      ...req.body,
      owner: req.user.id
    };

    const turf = await Turf.create(turfData);

    res.status(201).json({
      success: true,
      message: 'Turf created successfully',
      data: turf
    });
  } catch (error) {
    console.error('Create turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating turf',
      error: error.message
    });
  }
};

// @desc    Update turf
// @route   PUT /api/turfs/:id
// @access  Private (Admin only)
exports.updateTurf = async (req, res) => {
  try {
    let turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check ownership
    if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this turf'
      });
    }

    turf = await Turf.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Turf updated successfully',
      data: turf
    });
  } catch (error) {
    console.error('Update turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating turf',
      error: error.message
    });
  }
};

// @desc    Delete turf
// @route   DELETE /api/turfs/:id
// @access  Private (Admin only)
exports.deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check ownership
    if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this turf'
      });
    }

    await turf.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Turf deleted successfully'
    });
  } catch (error) {
    console.error('Delete turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting turf',
      error: error.message
    });
  }
};

// @desc    Get available time slots for a turf on a specific date
// @route   GET /api/turfs/:id/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Get all bookings for the date
    const bookingDate = new Date(date);
    const bookings = await Booking.find({
      turf: turf._id,
      bookingDate: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lt: new Date(bookingDate.setHours(23, 59, 59, 999))
      },
      bookingStatus: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    // Generate all possible slots
    const { openTime, closeTime, slotDuration } = turf.operatingHours;
    const allSlots = generateTimeSlots(openTime, closeTime, slotDuration);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => {
      return !bookings.some(booking => {
        return (
          slot.startTime === booking.timeSlot.startTime &&
          slot.endTime === booking.timeSlot.endTime
        );
      });
    });

    res.status(200).json({
      success: true,
      data: {
        date,
        availableSlots,
        bookedSlots: bookings.map(b => b.timeSlot)
      }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

// @desc    Add review to turf
// @route   POST /api/turfs/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check if user already reviewed
    const existingReview = turf.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this turf'
      });
    }

    // Add review
    turf.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Recalculate average rating
    turf.calculateAverageRating();

    await turf.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: turf
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, duration) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentTime = startHour * 60 + startMin;
  const endTimeMinutes = endHour * 60 + endMin;

  while (currentTime < endTimeMinutes) {
    const slotStart = currentTime;
    const slotEnd = currentTime + duration;

    if (slotEnd <= endTimeMinutes) {
      const startHours = Math.floor(slotStart / 60);
      const startMinutes = slotStart % 60;
      const endHours = Math.floor(slotEnd / 60);
      const endMinutes = slotEnd % 60;

      slots.push({
        startTime: `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`,
        endTime: `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`,
        duration
      });
    }

    currentTime += duration;
  }

  return slots;
}
