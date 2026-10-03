import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';

export default function RequireAuth({ children }) {
  const location = useLocation();
  const isAuthenticated = api.auth.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to admin login with return location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
