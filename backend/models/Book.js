const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul buku harus diisi'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Nama penulis harus diisi'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN harus diisi'],
    unique: true,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  publishYear: {
    type: Number
  },
  category: {
    type: String,
    required: [true, 'Kategori harus diisi'],
    enum: ['Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 'Biografi', 'Anak-anak', 'Lainnya']
  },
  description: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Stok harus diisi'],
    default: 0,
    min: 0
  },
  availableStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  rentalPrice: {
    type: Number,
    required: [true, 'Harga sewa harus diisi'],
    min: 0
  },
  cover: {
    type: String,
    default: 'default-book-cover.jpg'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update isAvailable berdasarkan availableStock
bookSchema.pre('save', function(next) {
  this.isAvailable = this.availableStock > 0;
  next();
});

module.exports = mongoose.model('Book', bookSchema);
