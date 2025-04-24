import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoutes({ Component, allowedRoles = [], requireAuth = true }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    // Check if authentication is required but user is not logged in
    if (requireAuth && !token) {
      navigate('/login');
      return;
    }
    
    // Check if there are role restrictions and the user doesn't have permission
    if (token && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      navigate('/');
      return;
    }
  }, [token, navigate, allowedRoles, userRole, requireAuth]);

  // Don't render anything during redirect
  if (requireAuth && !token) {
    return null;
  }
  
  // Don't render if user doesn't have the required role
  if (token && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return null;
  }

  // If all checks pass, render the component
  return <Component />;
}

export default ProtectedRoutes;