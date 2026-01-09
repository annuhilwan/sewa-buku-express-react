# Panduan Lengkap - Sistem Persewaan Buku

Aplikasi fullstack untuk sistem persewaan buku dengan fitur lengkap untuk User dan Admin.

## Tech Stack

### Backend
- Node.js + Express.js
- MySQL dengan Sequelize ORM
- JWT Authentication
- bcryptjs untuk password hashing

### Frontend
- React 18
- React Router v6
- Axios
- Context API

## Fitur

### User
- Register & Login
- Browse dan cari buku
- Filter buku berdasarkan kategori
- Lihat detail buku
- Sewa buku dengan durasi custom
- Lihat riwayat rental
- Return dan cancel rental
- Update profile & password

### Admin
- Dashboard dengan statistik lengkap
- Kelola buku (CRUD)
- Lihat dan kelola semua rental
- Statistik pendapatan dan denda
- Filter dan sorting data

## Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd testreact
```

### 2. Setup Database MySQL

```bash
# Login ke MySQL
mysql -u root -p

# Atau gunakan phpMyAdmin, lalu copy-paste SQL berikut:
```

```sql
CREATE DATABASE IF NOT EXISTS sewabuku;
USE sewabuku;

-- Copy semua isi dari backend/database.sql
```

Atau import file SQL:
```bash
mysql -u root -p < backend/database.sql
```

### 3. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env

# Edit .env sesuai konfigurasi MySQL Anda
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=sewabuku
# DB_PORT=3306
# JWT_SECRET=your_secret_key

# Jalankan backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 4. Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan frontend
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## Struktur Project

```
sewabukuexpressreact/
├── backend/
│   ├── config/
│   │   └── database-mysql.js
│   ├── models-mysql/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Rental.js
│   │   └── index.js
│   ├── controllers-mysql/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── rentalController.js
│   ├── routes-mysql/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── rentalRoutes.js
│   ├── middleware/
│   │   └── auth-mysql.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── database.sql
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── PANDUAN_LENGKAP.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user baru
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get profile
- PUT `/api/auth/updateprofile` - Update profile
- PUT `/api/auth/updatepassword` - Update password

### Books
- GET `/api/books` - Get semua buku (public)
- GET `/api/books/:id` - Get detail buku (public)
- POST `/api/books` - Tambah buku (admin only)
- PUT `/api/books/:id` - Update buku (admin only)
- DELETE `/api/books/:id` - Hapus buku (admin only)
- GET `/api/books/admin/stats` - Statistik buku (admin only)

### Rentals
- POST `/api/rentals` - Sewa buku (private)
- GET `/api/rentals` - Get rentals (private)
- GET `/api/rentals/:id` - Get detail rental (private)
- PUT `/api/rentals/:id/return` - Return buku (private)
- PUT `/api/rentals/:id/cancel` - Cancel rental (private)
- GET `/api/rentals/admin/stats` - Statistik rental (admin only)

## Cara Membuat Admin

Secara default, user yang register akan memiliki role `user`. Untuk membuat admin:

### Opsi 1: Via Register + Update Database
1. Register melalui aplikasi
2. Update role di database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Opsi 2: Langsung Insert ke Database
```sql
INSERT INTO users (name, email, password, role, phone, address, isActive) VALUES
('Admin', 'admin@sewabuku.com', '$2a$10$...hash...', 'admin', '08123456789', 'Alamat Admin', TRUE);
```

*Note: Password harus di-hash terlebih dahulu menggunakan bcrypt*

## Testing Aplikasi

### 1. Register User Baru
- Buka `http://localhost:3000/register`
- Isi form registrasi
- Akan otomatis login dan redirect ke dashboard user

### 2. Update Role menjadi Admin (di database)
```sql
UPDATE users SET role = 'admin' WHERE email = 'email_anda@example.com';
```

### 3. Logout dan Login Lagi
- Sekarang akan redirect ke dashboard admin
- Tambah beberapa buku
- Test fitur sewa buku dari akun user lain

## Fitur Sistem

### Manajemen Stok Otomatis
- Stok tersedia berkurang saat buku disewa
- Stok kembali bertambah saat buku dikembalikan atau rental dibatalkan

### Sistem Denda
- Denda otomatis Rp 5.000/hari untuk keterlambatan
- Dihitung saat user mengembalikan buku

### Status Rental
- **active**: Rental sedang berjalan
- **returned**: Buku sudah dikembalikan
- **overdue**: Melewati jatuh tempo
- **cancelled**: Rental dibatalkan

## Troubleshooting

### Backend tidak bisa konek ke MySQL
- Pastikan MySQL service sudah running
- Cek konfigurasi di `.env` apakah sudah benar
- Test koneksi: `mysql -u root -p`

### Frontend error CORS
- Pastikan backend sudah enable CORS
- Check apakah proxy di `frontend/package.json` sudah benar

### Token expired
- Logout dan login kembali
- Token berlaku 7 hari (bisa diubah di `.env` - JWT_EXPIRE)

### Port sudah digunakan
**Backend:**
```bash
# Ubah PORT di .env
PORT=5001
```

**Frontend:**
```bash
# Set PORT di terminal sebelum npm start
PORT=3001 npm start
```

## Development

### Backend dengan nodemon
```bash
cd backend
npm run dev
```

### Frontend dengan hot reload
```bash
cd frontend
npm start
```

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Hasil build ada di folder build/
```

## License

MIT License
