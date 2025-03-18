import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {

  const isAuthenticated = localStorage.getItem('username') && localStorage.getItem('email');
  

  const userRole = localStorage.getItem('role');
  

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; 
  }
  
  return children ? children : <Outlet />;
};

export default PrivateRoute;