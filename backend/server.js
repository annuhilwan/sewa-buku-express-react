require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database-mysql');

// Import routes
const authRoutes = require('./routes-mysql/authRoutes');
const bookRoutes = require('./routes-mysql/bookRoutes');
const rentalRoutes = require('./routes-mysql/rentalRoutes');

// Connect ke database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/rentals', rentalRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Selamat datang di API Persewaan Buku',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getProfile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/updateprofile',
        updatePassword: 'PUT /api/auth/updatepassword'
      },
      books: {
        getAll: 'GET /api/books',
        getOne: 'GET /api/books/:id',
        create: 'POST /api/books (Admin only)',
        update: 'PUT /api/books/:id (Admin only)',
        delete: 'DELETE /api/books/:id (Admin only)',
        stats: 'GET /api/books/admin/stats (Admin only)'
      },
      rentals: {
        create: 'POST /api/rentals',
        getAll: 'GET /api/rentals',
        getOne: 'GET /api/rentals/:id',
        return: 'PUT /api/rentals/:id/return',
        cancel: 'PUT /api/rentals/:id/cancel',
        stats: 'GET /api/rentals/admin/stats (Admin only)'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
