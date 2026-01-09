# Frontend React - Sistem Persewaan Buku

Frontend aplikasi persewaan buku dengan React yang mendukung 2 role: **User** dan **Admin**.

## Tech Stack

- **React 18** - Library UI
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Context API** - State Management

## Fitur

### User
- Login & Register
- Browse daftar buku
- Cari dan filter buku
- Detail buku
- Sewa buku
- Lihat riwayat rental
- Return dan cancel rental
- Update profile

### Admin
- Dashboard dengan statistik
- Kelola buku (CRUD)
- Kelola semua rental
- Lihat semua user
- Statistik lengkap

## Instalasi

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Konfigurasi

Pastikan backend sudah berjalan di `http://localhost:5000`

Proxy sudah dikonfigurasi di `package.json`:
```json
"proxy": "http://localhost:5000"
```

### 3. Jalankan Development Server

```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## Struktur Folder

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Komponen reusable
│   │   ├── Navbar.js
│   │   ├── PrivateRoute.js
│   │   └── AdminRoute.js
│   ├── context/             # Context API
│   │   └── AuthContext.js
│   ├── pages/               # Halaman
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── user/            # Halaman User
│   │   │   ├── Dashboard.js
│   │   │   ├── BookList.js
│   │   │   ├── BookDetail.js
│   │   │   ├── MyRentals.js
│   │   │   └── Profile.js
│   │   └── admin/           # Halaman Admin
│   │       ├── Dashboard.js
│   │       ├── Books.js
│   │       ├── Rentals.js
│   │       └── Users.js
│   ├── services/            # API Services
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Routes

### Public Routes
- `/login` - Halaman login
- `/register` - Halaman register

### User Routes (Private)
- `/user` - Dashboard user
- `/books` - Daftar semua buku
- `/books/:id` - Detail buku
- `/my-rentals` - Riwayat rental user
- `/profile` - Profile user

### Admin Routes (Admin Only)
- `/admin` - Dashboard admin
- `/admin/books` - Kelola buku
- `/admin/rentals` - Kelola rental
- `/admin/users` - Kelola user

## API Integration

File `src/services/api.js` berisi semua endpoint API:

```javascript
// Books
booksAPI.getAll(params)
booksAPI.getById(id)
booksAPI.create(data)
booksAPI.update(id, data)
booksAPI.delete(id)
booksAPI.getStats()

// Rentals
rentalsAPI.getAll(params)
rentalsAPI.getById(id)
rentalsAPI.create(data)
rentalsAPI.returnBook(id)
rentalsAPI.cancel(id)
rentalsAPI.getStats()

// Auth
authAPI.login(data)
authAPI.register(data)
authAPI.getProfile()
authAPI.updateProfile(data)
authAPI.updatePassword(data)
```

## Authentication

Authentication menggunakan Context API (`AuthContext`):

```javascript
const { user, login, logout, register, isAuthenticated, isAdmin } = useAuth();
```

Token JWT disimpan di localStorage dan otomatis ditambahkan ke header setiap request.

## Komponen yang Sudah Dibuat

### ✅ Selesai
1. Login & Register
2. AuthContext
3. PrivateRoute & AdminRoute
4. Navbar
5. User Dashboard
6. API Services

### 📝 Perlu Dibuat (Template ada di bawah)
1. BookList.js - Daftar buku dengan filter
2. BookDetail.js - Detail buku dan form sewa
3. MyRentals.js - Riwayat rental user
4. Profile.js - Update profile user
5. Admin Dashboard - Statistik admin
6. Admin Books - CRUD buku
7. Admin Rentals - Kelola rental
8. Admin Users - Kelola user

## Template Komponen

### BookList.js (User)
```javascript
// Fitur:
// - List semua buku
// - Search by title/author
// - Filter by category
// - Link ke detail buku
```

### BookDetail.js (User)
```javascript
// Fitur:
// - Detail buku lengkap
// - Form sewa (pilih durasi)
// - Button sewa buku
```

### MyRentals.js (User)
```javascript
// Fitur:
// - List rental user
// - Filter by status
// - Button return
// - Button cancel
// - Info denda jika terlambat
```

### Profile.js (User)
```javascript
// Fitur:
// - Form update profile
// - Form update password
```

### Admin Dashboard
```javascript
// Fitur:
// - Card statistik (total buku, rental aktif, dll)
// - Chart/grafik (optional)
// - Recent activities
```

### Admin Books
```javascript
// Fitur:
// - Table list buku
// - Button tambah buku
// - Button edit/delete
// - Modal form CRUD
```

### Admin Rentals
```javascript
// Fitur:
// - Table semua rental
// - Filter by user/status
// - Info detail rental
// - Statistik revenue
```

## Cara Build Production

```bash
npm run build
```

Build akan tersimpan di folder `build/`

## Testing

```bash
npm test
```

## Default Login Credentials

Setelah backend setup dan insert sample data:

**Admin:**
- Email: admin@sewabuku.com
- Password: admin123

**User:**
- Email: user@sewabuku.com
- Password: user123

*Note: Credentials ini hanya contoh, sesuaikan dengan data di database Anda*

## Troubleshooting

### CORS Error
Pastikan backend sudah enable CORS

### API Not Found
Pastikan backend berjalan di port 5000 dan proxy di package.json sudah benar

### Token Expired
Logout dan login kembali
