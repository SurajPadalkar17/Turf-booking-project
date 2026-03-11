const express = require('express');
const router = express.Router();
const {
  getAllTurfs,
  getNearbyTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  deleteTurf,
  getAvailableSlots,
  addReview
} = require('../controllers/turf.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  turfValidation,
  mongoIdValidation,
  searchValidation,
  validate
} = require('../middleware/validation.middleware');

// Public routes
router.get('/', getAllTurfs);
router.get('/nearby', searchValidation, validate, getNearbyTurfs);
router.get('/:id', mongoIdValidation, validate, getTurfById);
router.get('/:id/available-slots', mongoIdValidation, validate, getAvailableSlots);

// Protected routes
router.post('/:id/reviews', protect, mongoIdValidation, validate, addReview);

// Admin routes
router.post('/', protect, authorize('admin'), turfValidation, validate, createTurf);
router.put('/:id', protect, authorize('admin'), mongoIdValidation, validate, updateTurf);
router.delete('/:id', protect, authorize('admin'), mongoIdValidation, validate, deleteTurf);

module.exports = router;
