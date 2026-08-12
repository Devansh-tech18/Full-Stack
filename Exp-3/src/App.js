// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import { Dashboard, EditorWorkspace, AdminPanel, Unauthorized } from './pages/Pages';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Publicly accessible to ANY logged in user */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Restricted to Admins and Editors */}
          <Route 
            path="/editor" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Editor']}>
                <EditorWorkspace />
              </ProtectedRoute>
            } 
          />
          
          {/* Restricted to Admins ONLY */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;