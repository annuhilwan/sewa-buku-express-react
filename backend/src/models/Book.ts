import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BookAttributes } from '../types';

interface BookCreationAttributes extends Optional<BookAttributes, 'id' | 'publisher' | 'publishYear' | 'description' | 'cover' | 'isAvailable' | 'createdAt' | 'updatedAt'> {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn!: string;
  public publisher?: string;
  public publishYear?: number;
  public category!: 'Fiksi' | 'Non-Fiksi' | 'Sains' | 'Teknologi' | 'Sejarah' | 'Biografi' | 'Anak-anak' | 'Lainnya';
  public description?: string;
  public stock!: number;
  public availableStock!: number;
  public rentalPrice!: number;
  public cover?: string;
  public isAvailable!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Judul buku harus diisi' }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama penulis harus diisi' }
      }
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
      allowNull: false
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
        min: { args: [0], msg: 'Stok tidak boleh negatif' }
      }
    },
    availableStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Stok tersedia tidak boleh negatif' }
      }
    },
    rentalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Harga sewa tidak boleh negatif' }
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
  },
  {
    tableName: 'books',
    sequelize,
    timestamps: true,
    hooks: {
      beforeSave: (book: Book) => {
        book.isAvailable = book.availableStock > 0;
      }
    }
  }
);

export default Book;
