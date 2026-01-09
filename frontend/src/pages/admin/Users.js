import React from 'react';
import Navbar from '../../components/Navbar';

const AdminUsers = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Kelola User</h1>

        <div className="alert alert-info">
          <strong>Coming Soon!</strong>
          <p style={{ margin: '10px 0 0 0' }}>
            Halaman kelola user sedang dalam pengembangan.
            Fitur yang akan tersedia:
          </p>
          <ul style={{ marginTop: '10px', marginBottom: 0 }}>
            <li>List semua user</li>
            <li>Aktifkan/Nonaktifkan user</li>
            <li>Ubah role user (user/admin)</li>
            <li>Lihat detail aktivitas user</li>
          </ul>
        </div>

        <div className="card">
          <p>Untuk sementara, Anda dapat mengelola user melalui database MySQL secara langsung.</p>
          <p><strong>Contoh Query:</strong></p>
          <pre style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
{`-- Lihat semua user
SELECT * FROM users;

-- Ubah role menjadi admin
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- Nonaktifkan user
UPDATE users SET isActive = FALSE WHERE id = 1;`}
          </pre>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
