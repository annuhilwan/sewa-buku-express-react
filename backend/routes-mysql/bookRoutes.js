const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBookStats
} = require('../controllers-mysql/bookController');
const { protect, authorize } = require('../middleware/auth-mysql');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);

// Admin only routes
router.get('/admin/stats', protect, authorize('admin'), getBookStats);
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;
