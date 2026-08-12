// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading">Checking Session...</div>;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but doesn't have the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;