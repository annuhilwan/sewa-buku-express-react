import { sequelize } from '../config/database';
import User from './User';
import Book from './Book';
import Rental from './Rental';

// Define relationships
User.hasMany(Rental, { foreignKey: 'userId', as: 'rentals' });
Rental.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Book.hasMany(Rental, { foreignKey: 'bookId', as: 'rentals' });
Rental.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

export { sequelize, User, Book, Rental };
export default { sequelize, User, Book, Rental };
