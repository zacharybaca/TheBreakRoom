import { useState, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext.jsx';

// Helper: decode JWT payload safely
const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  // --- AUTH FUNCTIONS ---

  const loginUser = async ({ identifier, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    const { accessToken, ...userData } = data;

    localStorage.setItem('accessToken', accessToken);
    setUser(userData);

    scheduleAutoRefresh(accessToken);
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      localStorage.removeItem('accessToken');
      clearRefreshTimer();
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (!data.accessToken) return null;

      localStorage.setItem('accessToken', data.accessToken);
      scheduleAutoRefresh(data.accessToken);
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

  // --- AUTO REFRESH LOGIC ---

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const scheduleAutoRefresh = (token) => {
    clearRefreshTimer();

    const decoded = decodeJwt(token);
    if (!decoded?.exp) return;

    const expiresAt = decoded.exp * 1000; // convert to ms
    const now = Date.now();

    // Refresh 1 minute before expiry
    const refreshIn = expiresAt - now - 60 * 1000;

    if (refreshIn > 0) {
      refreshTimerRef.current = setTimeout(async () => {
        console.log('🔄 Auto-refreshing access token...');
        await refreshToken();
      }, refreshIn);
    }
  };

  // --- INITIAL BOOTSTRAP ON APP LOAD ---
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

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.warn('User could not be authenticated', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => clearRefreshTimer(); // cleanup timer on unmount
  }, []);

  // --- CONTEXT VALUE ---
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
