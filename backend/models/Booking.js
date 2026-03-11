const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: [true, 'Turf is required']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    }
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [30, 'Duration must be at least 30 minutes']
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['razorpay', 'cash', 'upi', 'card', 'wallet'],
      default: 'razorpay'
    },
    transactionId: {
      type: String,
      default: ''
    },
    razorpayOrderId: {
      type: String,
      default: ''
    },
    razorpayPaymentId: {
      type: String,
      default: ''
    },
    razorpaySignature: {
      type: String,
      default: ''
    },
    paidAt: {
      type: Date
    },
    refundedAt: {
      type: Date
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  customerDetails: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    playerCount: {
      type: Number,
      min: 1
    }
  },
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: {
      type: Date
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      maxlength: 500
    },
    refundEligible: {
      type: Boolean,
      default: false
    }
  },
  specialRequests: {
    type: String,
    maxlength: 500,
    default: ''
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for checking slot availability
bookingSchema.index({ 
  turf: 1, 
  bookingDate: 1, 
  'timeSlot.startTime': 1 
});

// Index for user bookings
bookingSchema.index({ user: 1, bookingDate: -1 });

// Index for payment status queries
bookingSchema.index({ 'payment.status': 1 });

// Static method to check slot availability
bookingSchema.statics.isSlotAvailable = async function(turfId, date, startTime, endTime) {
  const existingBooking = await this.findOne({
    turf: turfId,
    bookingDate: date,
    bookingStatus: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        'timeSlot.startTime': { $lt: endTime },
        'timeSlot.endTime': { $gt: startTime }
      }
    ]
  });
  
  return !existingBooking;
};

// Method to calculate cancellation refund
bookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const bookingDateTime = new Date(this.bookingDate);
  const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
  
  // Refund policy: 100% if cancelled 24+ hours before, 50% if 12-24 hours, 0% if less than 12 hours
  if (hoursUntilBooking >= 24) {
    return this.pricing.totalAmount;
  } else if (hoursUntilBooking >= 12) {
    return this.pricing.totalAmount * 0.5;
  } else {
    return 0;
  }
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
