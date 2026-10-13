import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function RoleRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message="Authorizing..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.includes(user.role);
  if (!hasRole) {
    // If not allowed, redirect to student or client dashboard
    return <Navigate to={user.role === 'ROLE_CLIENT' ? '/client/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
}
