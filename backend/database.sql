-- Buat Database
CREATE DATABASE IF NOT EXISTS sewabuku;
USE sewabuku;

-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  phone VARCHAR(255),
  address TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Books
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(255) NOT NULL UNIQUE,
  publisher VARCHAR(255),
  publishYear INT,
  category ENUM('Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 'Biografi', 'Anak-anak', 'Lainnya') NOT NULL,
  description TEXT,
  stock INT NOT NULL DEFAULT 0,
  availableStock INT NOT NULL DEFAULT 0,
  rentalPrice DECIMAL(10, 2) NOT NULL,
  cover VARCHAR(255) DEFAULT 'default-book-cover.jpg',
  isAvailable BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Rentals
CREATE TABLE IF NOT EXISTS rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  bookId INT NOT NULL,
  rentalDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dueDate TIMESTAMP NOT NULL,
  returnDate TIMESTAMP NULL,
  status ENUM('active', 'returned', 'overdue', 'cancelled') DEFAULT 'active',
  totalPrice DECIMAL(10, 2) NOT NULL,
  lateFee DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
  INDEX idx_user_status (userId, status),
  INDEX idx_book_status (bookId, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Data Admin Default (password: admin123)
-- Password hash untuk 'admin123' menggunakan bcrypt
INSERT INTO users (name, email, password, role, phone, address, isActive) VALUES
('Administrator', 'admin@sewabuku.com', '$2a$10$XQZvCqHqz8qQqY8VQqE9JuYNKZw5JQRqNQZ5JQZvCqHqz8qQqY8VQ', 'admin', '081234567890', 'Kantor Pusat', TRUE)
ON DUPLICATE KEY UPDATE email = email;

-- Insert Sample Books
INSERT INTO books (title, author, isbn, publisher, publishYear, category, description, stock, availableStock, rentalPrice, cover) VALUES
('Clean Code', 'Robert C. Martin', '9780132350884', 'Prentice Hall', 2008, 'Teknologi', 'A Handbook of Agile Software Craftsmanship', 5, 5, 10000, 'clean-code.jpg'),
('The Pragmatic Programmer', 'Andrew Hunt, David Thomas', '9780135957059', 'Addison-Wesley', 2019, 'Teknologi', 'Your Journey to Mastery', 3, 3, 12000, 'pragmatic-programmer.jpg'),
('Laskar Pelangi', 'Andrea Hirata', '9789793062792', 'Bentang Pustaka', 2005, 'Fiksi', 'Novel tentang kehidupan anak-anak di Belitung', 10, 10, 5000, 'laskar-pelangi.jpg'),
('Sapiens', 'Yuval Noah Harari', '9780062316097', 'Harper', 2015, 'Sejarah', 'A Brief History of Humankind', 4, 4, 15000, 'sapiens.jpg'),
('Atomic Habits', 'James Clear', '9780735211292', 'Avery', 2018, 'Non-Fiksi', 'An Easy & Proven Way to Build Good Habits', 7, 7, 8000, 'atomic-habits.jpg')
ON DUPLICATE KEY UPDATE isbn = isbn;

-- Insert Sample User (password: user123)
-- Password hash untuk 'user123' menggunakan bcrypt
INSERT INTO users (name, email, password, role, phone, address, isActive) VALUES
('John Doe', 'user@sewabuku.com', '$2a$10$YQZvCqHqz8qQqY8VQqE9JuYNKZw5JQRqNQZ5JQZvCqHqz8qQqY8VQ', 'user', '082345678901', 'Jl. Contoh No. 123', TRUE)
ON DUPLICATE KEY UPDATE email = email;

-- Notes:
-- Untuk menggunakan password admin123 dan user123, Anda perlu:
-- 1. Register melalui API dengan password yang diinginkan (otomatis akan di-hash)
-- 2. Atau update password hash di atas dengan hash yang benar
--
-- Untuk membuat hash password secara manual, gunakan bcrypt online tool
-- atau jalankan script Node.js berikut:
--
-- const bcrypt = require('bcryptjs');
-- const password = 'admin123';
-- const salt = bcrypt.genSaltSync(10);
-- const hash = bcrypt.hashSync(password, salt);
-- console.log(hash);
