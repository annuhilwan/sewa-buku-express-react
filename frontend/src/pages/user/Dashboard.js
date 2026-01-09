import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { booksAPI, rentalsAPI } from '../../services/api';
import './Dashboard.css';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalRentals: 0,
    activeRentals: 0,
    overdueRentals: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, rentalsRes] = await Promise.all([
        booksAPI.getAll({ available: true }),
        rentalsAPI.getAll()
      ]);

      setRecentBooks(booksRes.data.data.slice(0, 6));

      const rentals = rentalsRes.data.data;
      setStats({
        totalRentals: rentals.length,
        activeRentals: rentals.filter(r => r.status === 'active').length,
        overdueRentals: rentals.filter(r => r.status === 'overdue').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
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
        <h1>Dashboard User</h1>

        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-value">{stats.totalRentals}</div>
            <div className="stat-label">Total Rental</div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-value">{stats.activeRentals}</div>
            <div className="stat-label">Rental Aktif</div>
          </div>
          <div className="stat-card stat-danger">
            <div className="stat-value">{stats.overdueRentals}</div>
            <div className="stat-label">Terlambat</div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Buku Tersedia</h2>
            <Link to="/books" className="btn btn-primary">Lihat Semua</Link>
          </div>

          <div className="grid grid-3">
            {recentBooks.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  <div className="book-cover-placeholder">{book.title.charAt(0)}</div>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">Oleh: {book.author}</p>
                  <p className="book-category">{book.category}</p>
                  <div className="book-footer">
                    <span className="book-price">Rp {book.rentalPrice.toLocaleString()}/hari</span>
                    <Link to={`/books/${book.id}`} className="btn btn-sm btn-primary">
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
