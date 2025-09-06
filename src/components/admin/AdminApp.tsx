import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ErrorBoundary from './ErrorBoundary';
import { authAPI } from '../../utils/api';

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Validate the token with the backend
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setIsAuthenticated(true);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // Remove invalid token
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and set authenticated to false
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <AdminLogin onLogin={handleLogin} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AdminDashboard onLogout={handleLogout} />
    </ErrorBoundary>
  );
};

export default AdminApp;
