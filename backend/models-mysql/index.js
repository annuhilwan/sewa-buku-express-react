const { sequelize } = require('../config/database-mysql');
const User = require('./User');
const Book = require('./Book');
const Rental = require('./Rental');

// Define relationships
User.hasMany(Rental, { foreignKey: 'userId', as: 'rentals' });
Rental.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Book.hasMany(Rental, { foreignKey: 'bookId', as: 'rentals' });
Rental.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

module.exports = {
  sequelize,
  User,
  Book,
  Rental
};
