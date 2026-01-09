import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { booksAPI } from '../../services/api';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishYear: '',
    category: 'Fiksi',
    description: '',
    stock: 0,
    rentalPrice: 0
  });

  const categories = ['Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 'Biografi', 'Anak-anak', 'Lainnya'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editMode) {
        await booksAPI.update(currentBook.id, formData);
        setMessage({ type: 'success', text: 'Buku berhasil diupdate!' });
      } else {
        await booksAPI.create(formData);
        setMessage({ type: 'success', text: 'Buku berhasil ditambahkan!' });
      }

      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Gagal menyimpan buku'
      });
    }
  };

  const handleEdit = (book) => {
    setEditMode(true);
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher || '',
      publishYear: book.publishYear || '',
      category: book.category,
      description: book.description || '',
      stock: book.stock,
      rentalPrice: book.rentalPrice
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;

    try {
      await booksAPI.delete(id);
      setMessage({ type: 'success', text: 'Buku berhasil dihapus!' });
      fetchBooks();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Gagal menghapus buku'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishYear: '',
      category: 'Fiksi',
      description: '',
      stock: 0,
      rentalPrice: 0
    });
    setEditMode(false);
    setCurrentBook(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Kelola Buku</h1>
          <button onClick={handleAddNew} className="btn btn-primary">
            + Tambah Buku
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Judul</th>
                  <th>Penulis</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Tersedia</th>
                  <th>Harga Sewa</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id}>
                    <td>{book.isbn}</td>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td><span className="badge badge-secondary">{book.category}</span></td>
                    <td>{book.stock}</td>
                    <td>
                      {book.isAvailable ? (
                        <span className="badge badge-success">{book.availableStock}</span>
                      ) : (
                        <span className="badge badge-danger">0</span>
                      )}
                    </td>
                    <td>Rp {parseFloat(book.rentalPrice).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(book)}
                        className="btn btn-sm btn-warning"
                        style={{ marginRight: '5px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '10px',
              padding: '30px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2>{editMode ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Judul Buku *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Penulis *</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ISBN *</label>
                  <input
                    type="text"
                    name="isbn"
                    className="form-control"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Penerbit</label>
                    <input
                      type="text"
                      name="publisher"
                      className="form-control"
                      value={formData.publisher}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tahun Terbit</label>
                    <input
                      type="number"
                      name="publishYear"
                      className="form-control"
                      value={formData.publishYear}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Stok *</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Harga Sewa (per hari) *</label>
                    <input
                      type="number"
                      name="rentalPrice"
                      className="form-control"
                      value={formData.rentalPrice}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update' : 'Tambah'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBooks;
