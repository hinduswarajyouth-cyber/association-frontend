import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     🔁 INIT AUTH (ON APP LOAD)
  ========================= */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // ✅ Optimistic restore (fast UI)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(normalizeUser(parsedUser));
        setToken(storedToken);
      }

      try {
        // 🔐 Verify token with backend
        const res = await api.get("/auth/verify");

        const verifiedUser = normalizeUser(res.data.user);

        setUser(verifiedUser);
        setToken(storedToken);

        localStorage.setItem("user", JSON.stringify(verifiedUser));
      } catch (err) {
        // ❌ Invalid / expired token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* =========================
     🔑 LOGIN
  ========================= */
  const login = (authToken, userData) => {
    const normalized = normalizeUser(userData);

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(normalized));

    setToken(authToken);
    setUser(normalized);
  };

  /* =========================
     🚪 LOGOUT
  ========================= */
  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

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

/* =========================
   🧠 ROLE NORMALIZER (CRITICAL)
========================= */
function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    role: user.role?.replaceAll(" ", "_"), // 🔥 EC MEMBER → EC_MEMBER
  };
}

export const useAuth = () => useContext(AuthContext);
