const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Turf name is required'],
    trim: true,
    minlength: [3, 'Turf name must be at least 3 characters'],
    maxlength: [100, 'Turf name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    },
    landmark: {
      type: String,
      default: ''
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    whatsapp: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit WhatsApp number']
    }
  },
  pricing: {
    weekdayPrice: {
      type: Number,
      required: [true, 'Weekday price is required'],
      min: [0, 'Price cannot be negative']
    },
    weekendPrice: {
      type: Number,
      required: [true, 'Weekend price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  amenities: [{
    type: String,
    enum: [
      'Parking',
      'Changing Room',
      'Washroom',
      'First Aid',
      'Drinking Water',
      'Lighting',
      'Seating Area',
      'Equipment Rental',
      'Cafe/Canteen',
      'WiFi',
      'CCTV',
      'Security'
    ]
  }],
  sports: [{
    type: String,
    enum: ['Football', 'Cricket', 'Badminton', 'Basketball', 'Tennis', 'Hockey', 'Volleyball'],
    required: true
  }],
  turfType: {
    type: String,
    enum: ['Natural Grass', 'Artificial Turf', 'Hybrid', 'Indoor', 'Outdoor'],
    required: [true, 'Turf type is required']
  },
  size: {
    length: {
      type: Number,
      required: true,
      min: 0
    },
    width: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['meters', 'feet'],
      default: 'meters'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  operatingHours: {
    openTime: {
      type: String,
      required: [true, 'Opening time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    closeTime: {
      type: String,
      required: [true, 'Closing time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    slotDuration: {
      type: Number,
      default: 60, // in minutes
      enum: [30, 60, 90, 120]
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  features: {
    instantBooking: {
      type: Boolean,
      default: true
    },
    cancellationAllowed: {
      type: Boolean,
      default: true
    },
    advanceBookingDays: {
      type: Number,
      default: 30,
      min: 1
    }
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

// Index for geospatial queries
turfSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
turfSchema.index({ 
  name: 'text', 
  description: 'text',
  'location.city': 'text',
  'location.address': 'text'
});

// Method to calculate average rating
turfSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

// Static method to find nearby turfs
turfSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    },
    isActive: true
  });
};

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
