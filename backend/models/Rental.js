const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  rentalDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue', 'cancelled'],
    default: 'active'
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  lateFee: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index untuk query yang sering digunakan
rentalSchema.index({ user: 1, status: 1 });
rentalSchema.index({ book: 1, status: 1 });

// Method untuk menghitung denda keterlambatan
rentalSchema.methods.calculateLateFee = function() {
  if (this.returnDate && this.returnDate > this.dueDate) {
    const daysLate = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    this.lateFee = daysLate * 5000; // Rp 5000 per hari
  }
  return this.lateFee;
};

// Update status menjadi overdue jika melewati dueDate
rentalSchema.pre('save', function(next) {
  if (this.status === 'active' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  next();
});

module.exports = mongoose.model('Rental', rentalSchema);
