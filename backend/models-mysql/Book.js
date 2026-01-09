const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-mysql');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Judul buku harus diisi'
      }
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nama penulis harus diisi'
      }
    }
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'ISBN sudah terdaftar'
    }
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publishYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 'Biografi', 'Anak-anak', 'Lainnya'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Kategori harus diisi'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stok tidak boleh negatif'
      }
    }
  },
  availableStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stok tersedia tidak boleh negatif'
      }
    }
  },
  rentalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Harga sewa tidak boleh negatif'
      }
    }
  },
  cover: {
    type: DataTypes.STRING,
    defaultValue: 'default-book-cover.jpg'
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'books',
  timestamps: true,
  hooks: {
    beforeSave: (book) => {
      book.isAvailable = book.availableStock > 0;
    }
  }
});

module.exports = Book;
