// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // Don't show navbar on login screen

  return (
    <nav className="navbar">
      <div className="nav-brand">Security Portal</div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        
        {/* Conditional Rendering based on Roles */}
        {(user.role === 'Admin' || user.role === 'Editor') && (
          <Link to="/editor">Editor Workspace</Link>
        )}
        
        {user.role === 'Admin' && (
          <Link to="/admin" className="admin-link">Admin Panel</Link>
        )}
      </div>
      
      <div className="nav-profile">
        <span className="user-badge">Role: {user.role}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;