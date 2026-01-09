const express = require('express');
const {
  createRental,
  getRentals,
  getRental,
  returnBook,
  cancelRental,
  getRentalStats
} = require('../controllers-mysql/rentalController');
const { protect, authorize } = require('../middleware/auth-mysql');

const router = express.Router();

// Admin routes (harus sebelum /:id routes)
router.get('/admin/stats', protect, authorize('admin'), getRentalStats);

// User routes
router.post('/', protect, createRental);
router.get('/', protect, getRentals);
router.get('/:id', protect, getRental);
router.put('/:id/return', protect, returnBook);
router.put('/:id/cancel', protect, cancelRental);

module.exports = router;
