import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfile(profileData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile berhasil diupdate!' });
    } else {
      setMessage({ type: 'danger', text: result.message });
    }

    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', text: 'Password baru tidak cocok' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'Password minimal 6 karakter' });
      return;
    }

    setLoading(true);

    try {
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setMessage({ type: 'success', text: 'Password berhasil diupdate!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Gagal update password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Profile Saya</h1>

        <div className="card">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: activeTab === 'profile' ? '#007bff' : '#f8f9fa',
                color: activeTab === 'profile' ? 'white' : '#333',
                cursor: 'pointer',
                marginRight: '10px',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Profile
            </button>
            <button
              className={`tab ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: activeTab === 'password' ? '#007bff' : '#f8f9fa',
                color: activeTab === 'password' ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Ubah Password
            </button>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`} style={{ marginTop: '20px' }}>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>No. Telepon</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label>Alamat</label>
                <textarea
                  name="address"
                  className="form-control"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Password Saat Ini</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Konfirmasi Password Baru</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Ubah Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
