import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { booksAPI, rentalsAPI } from '../../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [notes, setNotes] = useState('');
  const [renting, setRenting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getById(id);
      setBook(response.data.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      setMessage({ type: 'danger', text: 'Gagal memuat data buku' });
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async (e) => {
    e.preventDefault();
    setRenting(true);
    setMessage({ type: '', text: '' });

    try {
      await rentalsAPI.create({
        bookId: parseInt(id),
        days: parseInt(days),
        notes
      });

      setMessage({ type: 'success', text: 'Buku berhasil disewa!' });
      setTimeout(() => {
        navigate('/my-rentals');
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Gagal menyewa buku'
      });
    } finally {
      setRenting(false);
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

  if (!book) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="alert alert-danger">Buku tidak ditemukan</div>
        </div>
      </>
    );
  }

  const totalPrice = book.rentalPrice * days;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
            ← Kembali
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
            <div>
              <div className="book-cover" style={{ height: '400px', borderRadius: '8px' }}>
                <div className="book-cover-placeholder" style={{ fontSize: '120px' }}>
                  {book.title.charAt(0)}
                </div>
              </div>
            </div>

            <div>
              <h1>{book.title}</h1>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
                Oleh: <strong>{book.author}</strong>
              </p>

              <div style={{ marginBottom: '20px' }}>
                <span className="badge badge-secondary">{book.category}</span>
                {book.isAvailable ? (
                  <span className="badge badge-success" style={{ marginLeft: '10px' }}>
                    Tersedia ({book.availableStock} buku)
                  </span>
                ) : (
                  <span className="badge badge-danger" style={{ marginLeft: '10px' }}>
                    Tidak Tersedia
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Penerbit:</strong> {book.publisher || '-'}</p>
                <p><strong>Tahun Terbit:</strong> {book.publishYear || '-'}</p>
                <p><strong>Harga Sewa:</strong> <span style={{ color: '#28a745', fontSize: '20px', fontWeight: 'bold' }}>
                  Rp {book.rentalPrice.toLocaleString()}/hari
                </span></p>
              </div>

              {book.description && (
                <div style={{ marginBottom: '20px' }}>
                  <h3>Deskripsi</h3>
                  <p>{book.description}</p>
                </div>
              )}

              {message.text && (
                <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
                  {message.text}
                </div>
              )}

              {book.isAvailable && (
                <div className="card" style={{ background: '#f8f9fa' }}>
                  <h3>Sewa Buku Ini</h3>
                  <form onSubmit={handleRent}>
                    <div className="form-group">
                      <label>Durasi Sewa (hari)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        min="1"
                        max="30"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Catatan (Opsional)</label>
                      <textarea
                        className="form-control"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        placeholder="Tambahkan catatan jika diperlukan"
                      ></textarea>
                    </div>

                    <div style={{ background: 'white', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
                      <h4>Total Pembayaran</h4>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
                        Rp {totalPrice.toLocaleString()}
                      </p>
                      <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                        {days} hari × Rp {book.rentalPrice.toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success btn-block"
                      disabled={renting}
                    >
                      {renting ? 'Memproses...' : 'Sewa Sekarang'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetail;
