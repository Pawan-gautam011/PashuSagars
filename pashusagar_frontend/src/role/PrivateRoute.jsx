import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }
  
  // If there are specific allowed roles and the user's role is not in it, redirect to home
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the children or the outlet
  return children ? children : <Outlet />;
};

export default PrivateRoute;