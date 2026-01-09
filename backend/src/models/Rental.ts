import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { RentalAttributes } from '../types';

interface RentalCreationAttributes extends Optional<RentalAttributes, 'id' | 'rentalDate' | 'returnDate' | 'status' | 'lateFee' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Rental extends Model<RentalAttributes, RentalCreationAttributes> implements RentalAttributes {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public rentalDate!: Date;
  public dueDate!: Date;
  public returnDate?: Date;
  public status!: 'active' | 'returned' | 'overdue' | 'cancelled';
  public totalPrice!: number;
  public lateFee!: number;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public calculateLateFee(): number {
    if (this.returnDate && this.returnDate > this.dueDate) {
      const daysLate = Math.ceil((this.returnDate.getTime() - this.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      this.lateFee = daysLate * 5000;
    }
    return this.lateFee;
  }
}

Rental.init(
  {
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
        min: { args: [0], msg: 'Total harga tidak boleh negatif' }
      }
    },
    lateFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Denda tidak boleh negatif' }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'rentals',
    sequelize,
    timestamps: true,
    hooks: {
      beforeSave: (rental: Rental) => {
        if (rental.status === 'active' && new Date() > rental.dueDate) {
          rental.status = 'overdue';
        }
      }
    }
  }
);

export default Rental;
