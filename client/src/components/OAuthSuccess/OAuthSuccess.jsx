import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import { useAuth } from '../../hooks/useAuth';
import Loading from '../Loading/Loading'; // Import your visual loader

export default function OAuthSuccess() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  // Use a ref to prevent strict mode from running this twice in development
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return; // Stop double-execution
    processedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // 1. Pass token to your Auth Context
      loginWithToken(token);

      // 2. Redirect user to the main feed immediately
      // The auth context will handle the state update asynchronously
      navigate('/news-feed', { replace: true });
    } else {
      // If no token found, send them back to login
      navigate('/', { replace: true });
    }
  }, [loginWithToken, navigate]);

  // 3. Show your Loading component instead of a blank screen
  return <Loading />;
}
