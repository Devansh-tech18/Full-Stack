// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { generateToken, decodeToken } from '../utils/jwt';

export const AuthContext = createContext();

// Mock database of users
const mockUsers = [
  { id: 1, username: 'admin', password: 'password', role: 'Admin' },
  { id: 2, username: 'editor', password: 'password', role: 'Editor' },
  { id: 3, username: 'viewer', password: 'password', role: 'Viewer' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on load
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        localStorage.removeItem('jwt_token'); // Remove expired token
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const token = generateToken(foundUser);
      localStorage.setItem('jwt_token', token);
      setUser(decodeToken(token));
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};