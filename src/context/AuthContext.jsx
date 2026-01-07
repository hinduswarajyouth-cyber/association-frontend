import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     INIT AUTH (ON APP LOAD)
  ========================= */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Optimistic restore (avoids UI flicker)
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }

      try {
        const res = await api.get("/auth/verify");
        setUser(res.data.user);
        setToken(storedToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (error) {
        localStorage.clear();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = (redirect = true) => {
    localStorage.clear();
    setUser(null);
    setToken(null);

    if (redirect) {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
