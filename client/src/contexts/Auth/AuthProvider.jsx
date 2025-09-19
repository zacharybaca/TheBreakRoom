import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for bootstrap step

  // --- Auth Functions ---

  const loginUser = async ({ identifier, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user || null);
  };

  const logoutUser = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      // handle non-JSON or empty response gracefully
      if (!res.ok) return null;

      const text = await res.text();
      if (!text) return null;

      const data = JSON.parse(text);
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.warn('Refresh token failed:', err.message);
      return null;
    }
  };

  const fetchProtectedData = async () => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch('/api/protected', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  // --- Bootstrap auth state on app load ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await refreshToken();
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await res.text();
        const userData = text ? JSON.parse(text) : null;

        setUser(res.ok ? userData : null);
      } catch (err) {
        console.warn('User could not be authenticated', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginUser,
        logoutUser,
        refreshToken,
        fetchProtectedData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
