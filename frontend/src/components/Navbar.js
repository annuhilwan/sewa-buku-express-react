import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to={isAdmin ? '/admin' : '/user'} className="navbar-brand">
            Sewa Buku
          </Link>

          <div className="navbar-menu">
            {isAdmin ? (
              <>
                <Link to="/admin" className="nav-link">Dashboard</Link>
                <Link to="/admin/books" className="nav-link">Kelola Buku</Link>
                <Link to="/admin/rentals" className="nav-link">Kelola Rental</Link>
              </>
            ) : (
              <>
                <Link to="/user" className="nav-link">Dashboard</Link>
                <Link to="/books" className="nav-link">Daftar Buku</Link>
                <Link to="/my-rentals" className="nav-link">Rental Saya</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
              </>
            )}

            <div className="nav-user">
              <span className="nav-username">{user?.name}</span>
              <span className="nav-role">{user?.role}</span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
