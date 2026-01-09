const { Book, sequelize } = require('../models-mysql');
const { Op } = require('sequelize');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const { category, search, available } = req.query;
    let where = {};

    // Filter berdasarkan category
    if (category) {
      where.category = category;
    }

    // Filter berdasarkan availability
    if (available === 'true') {
      where.isAvailable = true;
    }

    // Search berdasarkan title atau author
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } }
      ];
    }

    const books = await Book.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res) => {
  try {
    // Set availableStock sama dengan stock saat pertama kali dibuat
    req.body.availableStock = req.body.stock;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan'
      });
    }

    // Jika stock diupdate, sesuaikan availableStock
    if (req.body.stock !== undefined) {
      const stockDiff = req.body.stock - book.stock;
      req.body.availableStock = book.availableStock + stockDiff;
    }

    await book.update(req.body);

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan'
      });
    }

    await book.destroy();

    res.json({
      success: true,
      message: 'Buku berhasil dihapus',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get book statistics (for admin)
// @route   GET /api/books/admin/stats
// @access  Private/Admin
exports.getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const availableBooks = await Book.count({ where: { isAvailable: true } });
    const rentedBooks = await Book.count({ where: { isAvailable: false } });

    const booksByCategory = await Book.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category']
    });

    res.json({
      success: true,
      data: {
        totalBooks,
        availableBooks,
        rentedBooks,
        booksByCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
