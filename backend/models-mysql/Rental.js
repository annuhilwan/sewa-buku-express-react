const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-mysql');

const Rental = sequelize.define('Rental', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  },
  rentalDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'returned', 'overdue', 'cancelled'),
    defaultValue: 'active'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Total harga tidak boleh negatif'
      }
    }
  },
  lateFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Denda tidak boleh negatif'
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'rentals',
  timestamps: true,
  hooks: {
    beforeSave: (rental) => {
      // Update status menjadi overdue jika melewati dueDate
      if (rental.status === 'active' && new Date() > rental.dueDate) {
        rental.status = 'overdue';
      }
    }
  }
});

// Instance method untuk menghitung denda keterlambatan
Rental.prototype.calculateLateFee = function() {
  if (this.returnDate && this.returnDate > this.dueDate) {
    const daysLate = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    this.lateFee = daysLate * 5000; // Rp 5000 per hari
  }
  return this.lateFee;
};

module.exports = Rental;
