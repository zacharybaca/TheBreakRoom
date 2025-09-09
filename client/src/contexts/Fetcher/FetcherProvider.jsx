import { useState } from "react";
import { FetcherContext } from "./FetcherContext.jsx";
import { useAuth } from "../../hooks/useAuth.js"; // 👈 get tokens from here

export const FetcherProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  const fetcher = async (url, options = {}, fallbackError = "An error occurred.") => {
    const finalUrl = url.startsWith("/") ? `${backendUrl}${url}` : url;

    // attach access token if present
    const headers = {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const config = { credentials: "include", ...options, headers };

    try {
      let response = await fetch(finalUrl, config);

      // 🔄 if token expired, try refresh once
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(finalUrl, config); // retry once
        } else {
          logout(); // refresh failed → force logout
          return { success: false, error: "Session expired", status: 401 };
        }
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        const errorMessage = data?.message || fallbackError;
        setIsLoaded(true);
        return { success: false, error: errorMessage, status: response.status };
      }

      setIsLoaded(true);
      return { success: true, data };
    } catch (err) {
      setIsLoaded(true);
      return { success: false, error: "Network error", status: null };
    }
  };

  return (
    <FetcherContext.Provider value={{ fetcher, isLoaded, setIsLoaded }}>
      {children}
    </FetcherContext.Provider>
  );
};
