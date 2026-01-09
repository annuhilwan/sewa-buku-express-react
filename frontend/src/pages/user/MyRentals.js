import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { rentalsAPI } from '../../services/api';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleReturn = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin mengembalikan buku ini?')) return;

    try {
      await rentalsAPI.returnBook(id);
      setMessage({ type: 'success', text: 'Buku berhasil dikembalikan!' });
      fetchRentals();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Gagal mengembalikan buku'
      });
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan rental ini?')) return;

    try {
      await rentalsAPI.cancel(id);
      setMessage({ type: 'success', text: 'Rental berhasil dibatalkan!' });
      fetchRentals();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Gagal membatalkan rental'
      });
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
        <h1>Riwayat Rental Saya</h1>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

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
            <div className="alert alert-info">Belum ada riwayat rental</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Buku</th>
                    <th>Tanggal Sewa</th>
                    <th>Jatuh Tempo</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Denda</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map(rental => (
                    <tr key={rental.id}>
                      <td>
                        <strong>{rental.book.title}</strong>
                        <br />
                        <small>{rental.book.author}</small>
                      </td>
                      <td>{formatDate(rental.rentalDate)}</td>
                      <td>{formatDate(rental.dueDate)}</td>
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
                      <td>
                        {rental.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleReturn(rental.id)}
                              className="btn btn-success btn-sm"
                              style={{ marginRight: '5px' }}
                            >
                              Kembalikan
                            </button>
                            <button
                              onClick={() => handleCancel(rental.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Batal
                            </button>
                          </>
                        )}
                        {rental.status === 'overdue' && (
                          <button
                            onClick={() => handleReturn(rental.id)}
                            className="btn btn-success btn-sm"
                          >
                            Kembalikan
                          </button>
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

export default MyRentals;
