import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { booksAPI } from '../../services/api';
import '../user/Dashboard.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 'Biografi', 'Anak-anak', 'Lainnya'];

  useEffect(() => {
    fetchBooks();
  }, [search, category]);

  const fetchBooks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const response = await booksAPI.getAll(params);
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Daftar Buku</h1>

        <div className="card">
          <div className="filter-section">
            <input
              type="text"
              className="form-control"
              placeholder="Cari buku berdasarkan judul atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: '15px' }}
            />

            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : books.length === 0 ? (
          <div className="alert alert-info">Tidak ada buku ditemukan</div>
        ) : (
          <div className="grid grid-3">
            {books.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  <div className="book-cover-placeholder">{book.title.charAt(0)}</div>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">Oleh: {book.author}</p>
                  <p className="book-category">{book.category}</p>
                  <div className="book-status">
                    {book.isAvailable ? (
                      <span className="badge badge-success">Tersedia ({book.availableStock})</span>
                    ) : (
                      <span className="badge badge-danger">Tidak Tersedia</span>
                    )}
                  </div>
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
        )}
      </div>
    </>
  );
};

export default BookList;
