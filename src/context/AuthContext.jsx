import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER FROM TOKEN
     (ON APP START / REFRESH)
  ========================= */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      // 🔴 No token → not logged in
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // ✅ MUST MATCH BACKEND
        // backend: GET /auth/verify
        const res = await api.get("/auth/verify");

        // backend returns: { message, user }
        setUser(res.data.user);
      } catch (err) {
        console.error("AUTH VERIFY FAILED 👉", err);

        // ❌ invalid / expired token
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* =========================
     LOGIN (CALLED AFTER /login)
  ========================= */
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData); // 👈 SINGLE SOURCE OF TRUTH
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
   CUSTOM HOOK
========================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
