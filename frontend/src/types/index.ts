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
  category: 'Fiksi' | 'Non-Fiksi' | 'Sains' | 'Teknologi' | 'Sejarah' | 'Biografi' | 'Anak-anak' | 'Lainnya';
  description?: string;
  stock: number;
  availableStock: number;
  rentalPrice: number;
  cover?: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
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
    phone?: string;
  };
  book?: Book;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  errors?: any[];
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (userData: RegisterData) => Promise<LoginResult>;
  logout: () => void;
  updateProfile: (profileData: UpdateProfileData) => Promise<UpdateResult>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}

export interface UpdateResult {
  success: boolean;
  message?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface CreateRentalData {
  bookId: number;
  days: number;
  notes?: string;
}

export interface BookStats {
  totalBooks: number;
  availableBooks: number;
  rentedBooks: number;
  booksByCategory?: Array<{
    _id?: string;
    category?: string;
    count: number;
  }>;
}

export interface RentalStats {
  totalRentals: number;
  activeRentals: number;
  overdueRentals: number;
  returnedRentals: number;
  revenue: number;
  totalLateFees: number;
}
