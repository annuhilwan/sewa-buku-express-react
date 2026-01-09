const { Rental, Book, User } = require('../models-mysql');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database-mysql');

// @desc    Create new rental
// @route   POST /api/rentals
// @access  Private
exports.createRental = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { bookId, days } = req.body;

    // Cek ketersediaan buku
    const book = await Book.findByPk(bookId);
    if (!book) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan'
      });
    }

    if (book.availableStock < 1) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Buku tidak tersedia untuk disewa'
      });
    }

    // Hitung tanggal
    const rentalDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (days || 7)); // Default 7 hari

    // Hitung total harga
    const totalPrice = book.rentalPrice * (days || 7);

    // Buat rental
    const rental = await Rental.create({
      userId: req.user.id,
      bookId,
      rentalDate,
      dueDate,
      totalPrice,
      notes: req.body.notes
    }, { transaction: t });

    // Update stok buku
    book.availableStock -= 1;
    await book.save({ transaction: t });

    await t.commit();

    // Load relasi
    await rental.reload({
      include: [
        { model: Book, as: 'book' },
        { model: User, as: 'user' }
      ]
    });

    res.status(201).json({
      success: true,
      data: rental
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all rentals (admin) or user's rentals
// @route   GET /api/rentals
// @access  Private
exports.getRentals = async (req, res) => {
  try {
    const { status, userId } = req.query;
    let where = {};

    // Jika bukan admin, hanya tampilkan rental user sendiri
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    } else if (userId) {
      // Admin bisa filter berdasarkan userId
      where.userId = userId;
    }

    // Filter berdasarkan status
    if (status) {
      where.status = status;
    }

    const rentals = await Rental.findAll({
      where,
      include: [
        { model: Book, as: 'book' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single rental
// @route   GET /api/rentals/:id
// @access  Private
exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id, {
      include: [
        { model: Book, as: 'book' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental tidak ditemukan'
      });
    }

    // Cek authorization (user hanya bisa lihat rental sendiri)
    if (req.user.role !== 'admin' && rental.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki akses ke resource ini'
      });
    }

    res.json({
      success: true,
      data: rental
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Return book
// @route   PUT /api/rentals/:id/return
// @access  Private
exports.returnBook = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const rental = await Rental.findByPk(req.params.id, {
      include: [{ model: Book, as: 'book' }]
    });

    if (!rental) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Rental tidak ditemukan'
      });
    }

    // Cek authorization
    if (req.user.role !== 'admin' && rental.userId !== req.user.id) {
      await t.rollback();
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki akses ke resource ini'
      });
    }

    if (rental.status === 'returned') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Buku sudah dikembalikan'
      });
    }

    // Set return date dan hitung denda
    rental.returnDate = new Date();
    rental.calculateLateFee();
    rental.status = 'returned';

    await rental.save({ transaction: t });

    // Update stok buku
    const book = await Book.findByPk(rental.bookId);
    book.availableStock += 1;
    await book.save({ transaction: t });

    await t.commit();

    await rental.reload({
      include: [
        { model: Book, as: 'book' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.json({
      success: true,
      data: rental
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel rental (before pickup)
// @route   PUT /api/rentals/:id/cancel
// @access  Private
exports.cancelRental = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const rental = await Rental.findByPk(req.params.id);

    if (!rental) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Rental tidak ditemukan'
      });
    }

    // Cek authorization
    if (req.user.role !== 'admin' && rental.userId !== req.user.id) {
      await t.rollback();
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki akses ke resource ini'
      });
    }

    if (rental.status !== 'active') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Rental tidak dapat dibatalkan'
      });
    }

    rental.status = 'cancelled';
    await rental.save({ transaction: t });

    // Kembalikan stok buku
    const book = await Book.findByPk(rental.bookId);
    book.availableStock += 1;
    await book.save({ transaction: t });

    await t.commit();

    await rental.reload({
      include: [
        { model: Book, as: 'book' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.json({
      success: true,
      data: rental
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get rental statistics (admin)
// @route   GET /api/rentals/admin/stats
// @access  Private/Admin
exports.getRentalStats = async (req, res) => {
  try {
    const totalRentals = await Rental.count();
    const activeRentals = await Rental.count({ where: { status: 'active' } });
    const overdueRentals = await Rental.count({ where: { status: 'overdue' } });
    const returnedRentals = await Rental.count({ where: { status: 'returned' } });

    // Total pendapatan
    const revenue = await Rental.sum('totalPrice', {
      where: { status: 'returned' }
    });

    // Total denda
    const totalLateFees = await Rental.sum('lateFee', {
      where: { status: 'returned' }
    });

    res.json({
      success: true,
      data: {
        totalRentals,
        activeRentals,
        overdueRentals,
        returnedRentals,
        revenue: revenue || 0,
        totalLateFees: totalLateFees || 0
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
