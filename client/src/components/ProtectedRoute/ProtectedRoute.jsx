import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../Loading/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. If Auth is still checking the token, show the spinner instead of kicking the user out
  if (loading) {
    return <Loading />;
  }

  // 2. If finished loading and still no user, kick them out
  if (!isAuthenticated) {
    // Pass a message so the login page knows why they were redirected
    // The ErrorRouteWrapper or Login page can read this state
    return (
      <Navigate
        to="/"
        state={{ message: "Please log in to view that page." }}
        replace
      />
    );
  }

  // 3. Otherwise, render the protected page
  return children;
};

export default ProtectedRoute;
