import { AuthContext } from './AuthContext.jsx';


export const AuthProvider = ({ children }) => {

const loginUser = async ({ identifier, password }) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
    credentials: "include" // include refresh token cookie
  });
  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  setUser(data);
};

const logoutUser = async () => {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  localStorage.removeItem("accessToken");
  setUser(null);
};

const refreshToken = async () => {
  const res = await fetch("/api/auth/refresh", { method: "GET", credentials: "include" });
  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
};

const fetchProtectedData = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch("/api/protected", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};


return (
    <AuthContext.Provider value={{
        loginUser,
        logoutUser,
        refreshToken,
        fetchProtectedData
    }}>
            {children}
    </AuthContext.Provider>
)
}
