import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../Loading/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Loading State
  if (loading) {
    return <Loading />;
  }

  // 2. Access Check
  // FIX 1: We check if they are NOT authenticated
  if (isAuthenticated) {
    return (
      <Navigate
        to="/"
        // FIX 2: We pass 'from: location' so we can redirect them back later
        state={{
          message: 'Please log in to view that page.',
          from: location,
        }}
        replace
      />
    );
  }

  // 3. Render Page
  return children;
};

export default ProtectedRoute;
