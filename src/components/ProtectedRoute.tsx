import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isProtected?: boolean; // If true, only logged-in users can access. If false, only logged-out users can access.
  redirectPath?: string; // Path to redirect to if access is denied.
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isProtected = true, redirectPath = '/' }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.user?.isLoggedIn);

  if (isProtected) {
    // If the route is protected and the user is NOT logged in, redirect to login page
    if (!isLoggedIn) {
      return <Navigate to={redirectPath} replace />;
    }
  } else {
    // If the route is NOT protected (e.g., login page) and the user IS logged in, redirect to dashboard
    if (isLoggedIn) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
