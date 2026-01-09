# Backend API Persewaan Buku

Backend API untuk sistem persewaan buku dengan fitur manajemen user (admin & user regular), manajemen buku, dan manajemen rental.

## Tech Stack

- **Node.js** & **Express.js** - Framework backend
- **MySQL** - Database
- **Sequelize** - ORM untuk MySQL
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Fitur

### Authentication
- Register user baru
- Login user
- Get profile user
- Update profile user
- Update password

### Books Management (Admin)
- CRUD buku
- Filter buku berdasarkan kategori
- Search buku berdasarkan judul/penulis
- Statistik buku

### Rentals
- User dapat menyewa buku
- User dapat mengembalikan buku
- User dapat membatalkan rental
- Sistem denda otomatis untuk keterlambatan (Rp 5000/hari)
- Admin dapat melihat semua rental
- Statistik rental (Admin)

## Instalasi

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database MySQL

Buat database MySQL dengan nama `sewabuku`:

```sql
CREATE DATABASE sewabuku;
```

### 3. Setup Environment Variables

Buat file `.env` dari `.env.example`:

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi MySQL Anda:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sewabuku
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Jalankan Server

Development mode (dengan nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user baru | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get user profile | Private |
| PUT | `/api/auth/updateprofile` | Update profile | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |

### Books

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/books` | Get semua buku | Public |
| GET | `/api/books/:id` | Get detail buku | Public |
| POST | `/api/books` | Tambah buku baru | Admin |
| PUT | `/api/books/:id` | Update buku | Admin |
| DELETE | `/api/books/:id` | Hapus buku | Admin |
| GET | `/api/books/admin/stats` | Statistik buku | Admin |

### Rentals

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/rentals` | Buat rental baru | Private |
| GET | `/api/rentals` | Get rentals (semua untuk admin, milik sendiri untuk user) | Private |
| GET | `/api/rentals/:id` | Get detail rental | Private |
| PUT | `/api/rentals/:id/return` | Kembalikan buku | Private |
| PUT | `/api/rentals/:id/cancel` | Batalkan rental | Private |
| GET | `/api/rentals/admin/stats` | Statistik rental | Admin |

## Contoh Request

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08123456789",
  "address": "Jl. Contoh No. 123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Tambah Buku (Admin)
```bash
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "publisher": "Prentice Hall",
  "publishYear": 2008,
  "category": "Teknologi",
  "description": "A Handbook of Agile Software Craftsmanship",
  "stock": 5,
  "rentalPrice": 10000,
  "cover": "clean-code.jpg"
}
```

### Sewa Buku
```bash
POST /api/rentals
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": 1,
  "days": 7,
  "notes": "Untuk belajar clean code"
}
```

### Kembalikan Buku
```bash
PUT /api/rentals/:id/return
Authorization: Bearer <token>
```

## Database Schema

### Users Table
- id (PK)
- name
- email (unique)
- password (hashed)
- role (user/admin)
- phone
- address
- isActive
- createdAt
- updatedAt

### Books Table
- id (PK)
- title
- author
- isbn (unique)
- publisher
- publishYear
- category
- description
- stock
- availableStock
- rentalPrice
- cover
- isAvailable
- createdAt
- updatedAt

### Rentals Table
- id (PK)
- userId (FK)
- bookId (FK)
- rentalDate
- dueDate
- returnDate
- status (active/returned/overdue/cancelled)
- totalPrice
- lateFee
- notes
- createdAt
- updatedAt

## Role & Permissions

### User
- Register & Login
- View semua buku
- Sewa buku
- Kembalikan buku
- Batalkan rental
- View rental milik sendiri

### Admin
- Semua akses user
- CRUD buku
- View semua rental
- View statistik

## Cara Membuat Admin

Secara default, semua user yang register akan memiliki role `user`. Untuk membuat admin, Anda bisa:

1. Update langsung di database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

2. Atau buat migration/seeder untuk admin default

## Notes

- Database akan otomatis di-sync saat development mode
- Password di-hash menggunakan bcryptjs sebelum disimpan
- Token JWT berlaku selama 7 hari (bisa diubah di .env)
- Denda keterlambatan: Rp 5000/hari
- Stok buku otomatis berkurang saat rental dan bertambah saat return
