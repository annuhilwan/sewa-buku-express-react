import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { booksAPI, rentalsAPI } from '../../services/api';
import '../user/Dashboard.css';

const AdminDashboard = () => {
  const [bookStats, setBookStats] = useState(null);
  const [rentalStats, setRentalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, rentalsRes] = await Promise.all([
        booksAPI.getStats(),
        rentalsAPI.getStats()
      ]);

      setBookStats(booksRes.data.data);
      setRentalStats(rentalsRes.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Dashboard Admin</h1>

        <div className="dashboard-section">
          <h2>Statistik Buku</h2>
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-value">{bookStats?.totalBooks || 0}</div>
              <div className="stat-label">Total Buku</div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-value">{bookStats?.availableBooks || 0}</div>
              <div className="stat-label">Buku Tersedia</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-value">{bookStats?.rentedBooks || 0}</div>
              <div className="stat-label">Sedang Disewa</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Statistik Rental</h2>
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-value">{rentalStats?.totalRentals || 0}</div>
              <div className="stat-label">Total Rental</div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-value">{rentalStats?.activeRentals || 0}</div>
              <div className="stat-label">Rental Aktif</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-value">{rentalStats?.overdueRentals || 0}</div>
              <div className="stat-label">Terlambat</div>
            </div>
            <div className="stat-card stat-secondary">
              <div className="stat-value">{rentalStats?.returnedRentals || 0}</div>
              <div className="stat-label">Dikembalikan</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Pendapatan</h2>
          <div className="stats-grid">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <div className="stat-value">
                Rp {(rentalStats?.revenue || 0).toLocaleString()}
              </div>
              <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Pendapatan
              </div>
            </div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <div className="stat-value">
                Rp {(rentalStats?.totalLateFees || 0).toLocaleString()}
              </div>
              <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Denda
              </div>
            </div>
          </div>
        </div>

        {bookStats?.booksByCategory && bookStats.booksByCategory.length > 0 && (
          <div className="dashboard-section">
            <h2>Buku per Kategori</h2>
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Jumlah Buku</th>
                  </tr>
                </thead>
                <tbody>
                  {bookStats.booksByCategory.map((item, index) => (
                    <tr key={index}>
                      <td>{item._id || item.category}</td>
                      <td><strong>{item.count}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
