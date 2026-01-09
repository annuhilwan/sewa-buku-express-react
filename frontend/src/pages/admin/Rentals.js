import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { rentalsAPI } from '../../services/api';

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchRentals();
  }, [filter]);

  const fetchRentals = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await rentalsAPI.getAll(params);
      setRentals(response.data.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      returned: 'badge-secondary',
      overdue: 'badge-danger',
      cancelled: 'badge-warning'
    };
    return badges[status] || 'badge-secondary';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <h1>Kelola Rental</h1>

        <div className="card">
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginBottom: '20px' }}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="overdue">Terlambat</option>
            <option value="returned">Dikembalikan</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          {rentals.length === 0 ? (
            <div className="alert alert-info">Belum ada data rental</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Buku</th>
                    <th>Tanggal Sewa</th>
                    <th>Jatuh Tempo</th>
                    <th>Tanggal Kembali</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Denda</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map(rental => (
                    <tr key={rental.id}>
                      <td>#{rental.id}</td>
                      <td>
                        <strong>{rental.user.name}</strong>
                        <br />
                        <small>{rental.user.email}</small>
                      </td>
                      <td>
                        <strong>{rental.book.title}</strong>
                        <br />
                        <small>{rental.book.author}</small>
                      </td>
                      <td>{formatDate(rental.rentalDate)}</td>
                      <td>{formatDate(rental.dueDate)}</td>
                      <td>{rental.returnDate ? formatDate(rental.returnDate) : '-'}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(rental.status)}`}>
                          {rental.status}
                        </span>
                      </td>
                      <td>Rp {parseFloat(rental.totalPrice).toLocaleString()}</td>
                      <td>
                        {rental.lateFee > 0 ? (
                          <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                            Rp {parseFloat(rental.lateFee).toLocaleString()}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRentals;
