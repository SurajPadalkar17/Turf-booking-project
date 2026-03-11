const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// User login validation
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Turf creation validation
exports.turfValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Turf name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Turf name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('location.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('location.pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .matches(/^[0-9]{6}$/).withMessage('Please provide a valid 6-digit pincode'),
  body('pricing.weekdayPrice')
    .notEmpty().withMessage('Weekday price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('pricing.weekendPrice')
    .notEmpty().withMessage('Weekend price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

// Booking validation
exports.bookingValidation = [
  body('turfId')
    .notEmpty().withMessage('Turf ID is required')
    .isMongoId().withMessage('Invalid turf ID'),
  body('bookingDate')
    .notEmpty().withMessage('Booking date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('timeSlot.startTime')
    .notEmpty().withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (use HH:MM)'),
  body('timeSlot.endTime')
    .notEmpty().withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (use HH:MM)'),
  body('customerDetails.name')
    .trim()
    .notEmpty().withMessage('Customer name is required'),
  body('customerDetails.phone')
    .trim()
    .notEmpty().withMessage('Customer phone is required')
    .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('customerDetails.email')
    .trim()
    .notEmpty().withMessage('Customer email is required')
    .isEmail().withMessage('Please provide a valid email')
];

// MongoDB ID validation
exports.mongoIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format')
];

// Search query validation
exports.searchValidation = [
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isInt({ min: 100, max: 50000 }).withMessage('Radius must be between 100 and 50000 meters')
];
