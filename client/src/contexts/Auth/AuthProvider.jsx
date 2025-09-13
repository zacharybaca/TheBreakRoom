import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for bootstrap step

  // --- Auth Functions ---

  const loginUser = async ({ identifier, password }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
      credentials: "include", // include refresh token cookie
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user || null); // make sure backend sends user info
  };

  const logoutUser = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const refreshToken = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",   // ⬅️ changed from GET
      credentials: "include",
      headers: {
        "Content-Type": "application/json", // good practice with POST, even if no body
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Token refresh failed");
    }

    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  };


  const fetchProtectedData = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  // --- Bootstrap auth state on app load ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await refreshToken();

        // Fetch user profile after refresh
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = await res.json();
        if (res.ok) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('User could not be authenticated', err.message);
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
