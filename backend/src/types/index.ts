import { Request } from 'express';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookAttributes {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  category: 'Fiksi' | 'Non-Fiksi' | 'Sains' | 'Teknologi' | 'Sejarah' | 'Biografi' | 'Anak-anak' | 'Lainnya';
  description?: string;
  stock: number;
  availableStock: number;
  rentalPrice: number;
  cover?: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RentalAttributes {
  id: number;
  userId: number;
  bookId: number;
  rentalDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue' | 'cancelled';
  totalPrice: number;
  lateFee: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: UserAttributes;
}

export interface JWTPayload {
  id: number;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  category: string;
  description?: string;
  stock: number;
  rentalPrice: number;
  cover?: string;
}

export interface CreateRentalDTO {
  bookId: number;
  days: number;
  notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any[];
  count?: number;
}
