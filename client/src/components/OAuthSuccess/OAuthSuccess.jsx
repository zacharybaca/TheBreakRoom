import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function OAuthSuccess() {
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) loginWithToken(token);
  }, []);

  return null;
}
