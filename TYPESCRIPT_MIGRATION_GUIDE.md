# TypeScript Migration Guide

Panduan lengkap untuk migrasi Backend dan Frontend ke TypeScript.

## Status Migrasi

### ✅ Backend (Selesai)
- [x] Setup TypeScript configuration
- [x] Types dan Interfaces
- [x] Database configuration
- [x] User Model
- [ ] Book Model (Template tersedia)
- [ ] Rental Model (Template tersedia)
- [ ] Controllers (Template tersedia)
- [ ] Routes & Middleware (Template tersedia)
- [ ] Server (Template tersedia)

### 📝 Frontend (Perlu Dikerjakan)
- [ ] Setup TypeScript configuration
- [ ] Types dan Interfaces
- [ ] Context
- [ ] Services
- [ ] Components
- [ ] Pages

## Backend TypeScript Setup

### 1. Install Dependencies

```bash
cd backend
npm install --save-dev typescript ts-node @types/node @types/express @types/bcryptjs @types/cors @types/jsonwebtoken nodemon
```

### 2. Struktur Folder Baru

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Book.ts
│   │   ├── Rental.ts
│   │   └── index.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── bookController.ts
│   │   └── rentalController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── bookRoutes.ts
│   │   └── rentalRoutes.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── utils/
│   │   └── generateToken.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── dist/ (compiled output)
├── tsconfig.json
└── package.json
```

### 3. File yang Sudah Dibuat

#### ✅ tsconfig.json
Konfigurasi TypeScript compiler.

#### ✅ src/types/index.ts
Semua interfaces dan types:
- UserAttributes
- BookAttributes
- RentalAttributes
- AuthRequest
- DTO interfaces (RegisterDTO, LoginDTO, etc.)
- ApiResponse

#### ✅ src/config/database.ts
Database configuration dengan TypeScript.

#### ✅ src/models/User.ts
User model dengan TypeScript dan proper typing.

### 4. Template Models yang Perlu Dibuat

#### Book.ts Template

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BookAttributes } from '../types';

interface BookCreationAttributes extends Optional<BookAttributes, 'id' | 'publisher' | 'publishYear' | 'description' | 'cover' | 'createdAt' | 'updatedAt'> {}

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
```

### 5. Template Controllers

#### authController.ts Template

```typescript
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { AuthRequest, RegisterDTO, LoginDTO, ApiResponse } from '../types';

export const register = async (req: Request<{}, {}, RegisterDTO>, res: Response<ApiResponse>) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User dengan email ini sudah terdaftar'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// Login, getMe, updateProfile, updatePassword...
// Implement mengikuti pola yang sama dengan type safety
```

### 6. Template Middleware

#### auth.ts Template

```typescript
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, JWTPayload } from '../types';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Tidak ada akses. Token tidak ditemukan'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Akun tidak aktif'
      });
      return;
    }

    req.user = user.toJSON() as any;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role ${req.user?.role} tidak memiliki akses ke resource ini`
      });
      return;
    }
    next();
  };
};
```

### 7. Template Server

#### server.ts Template

```typescript
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import rentalRoutes from './routes/rentalRoutes';

dotenv.config();

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/rentals', rentalRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Selamat datang di API Persewaan Buku (TypeScript)'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
```

## Frontend TypeScript Setup

### 1. Konversi Create React App ke TypeScript

Jika project sudah ada:
```bash
cd frontend
npm install --save typescript @types/node @types/react @types/react-dom @types/react-router-dom
```

### 2. Rename Files

Rename semua file `.js` dan `.jsx` menjadi `.ts` dan `.tsx`:
- `.js` → `.ts` (untuk file non-React)
- `.jsx` → `.tsx` (untuk file React components)

### 3. Template Types Frontend

#### src/types/index.ts

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
  token?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  category: string;
  description?: string;
  stock: number;
  availableStock: number;
  rentalPrice: number;
  cover?: string;
  isAvailable: boolean;
}

export interface Rental {
  id: number;
  userId: number;
  bookId: number;
  rentalDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue' | 'cancelled';
  totalPrice: number;
  lateFee: number;
  notes?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  book?: Book;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  errors?: any[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}
```

### 4. Rename dan Update Files

#### Context Example (AuthContext.tsx)

```typescript
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, AuthContextType, RegisterData, ApiResponse } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ... rest of implementation dengan proper typing
};
```

## Langkah-langkah Migrasi

### Backend (Prioritas)

1. ✅ Setup TypeScript configuration
2. ✅ Create types/interfaces
3. ✅ Convert database config
4. ✅ Convert User model
5. Convert Book model (gunakan template)
6. Convert Rental model (gunakan template)
7. Convert controllers (gunakan template)
8. Convert routes & middleware
9. Convert server.ts
10. Test semua endpoints

### Frontend

1. Install TypeScript dependencies
2. Create tsconfig.json
3. Create types/index.ts
4. Rename files (.js → .ts, .jsx → .tsx)
5. Update Context dengan types
6. Update Services dengan types
7. Update Components dengan types
8. Update Pages dengan types
9. Fix all type errors
10. Test aplikasi

## Running TypeScript Version

### Backend
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

### Frontend
```bash
# Development
npm start

# Build
npm run build
```

## Tips Migrasi

1. **Mulai dari types** - Define semua interfaces dulu
2. **Migrasi bertahap** - Jangan sekaligus, satu file per satu
3. **Use strict mode** - Aktifkan strict TypeScript untuk type safety maksimal
4. **Test setelah setiap konversi** - Pastikan tidak ada breaking changes
5. **Use any sparingly** - Hindari menggunakan `any`, gunakan proper types

## Keuntungan TypeScript

✅ Type safety - Catch errors saat development
✅ Better IDE support - Autocomplete dan intellisense
✅ Easier refactoring - Confident changes
✅ Self-documenting code - Types sebagai dokumentasi
✅ Better team collaboration - Clear contracts

## File yang Sudah Dibuat (Backend)

1. ✅ package.json (updated dengan TypeScript)
2. ✅ tsconfig.json
3. ✅ src/types/index.ts
4. ✅ src/config/database.ts
5. ✅ src/models/User.ts

## Next Steps

Gunakan template di atas untuk melanjutkan konversi:
1. Buat Book.ts dan Rental.ts models
2. Buat semua controllers dengan proper typing
3. Convert routes dan middleware
4. Convert server.ts
5. Test backend
6. Lanjut ke frontend

Jika butuh bantuan untuk file spesifik, silakan request file mana yang ingin di-convert selanjutnya!
