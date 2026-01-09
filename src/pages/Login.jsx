import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import bg from "../assets/login-bg.png";

/* =========================
   FINAL LOGIN (NO FLICKER)
========================= */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const [params] = useSearchParams();
  const expired = params.get("expired");

  /* =========================
     HANDLE LOGIN
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // 🔒 prevent double submit

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      /**
       * Backend response:
       * {
       *   token,
       *   user: { id, name, username },
       *   role,
       *   isFirstLogin
       * }
       */
      const { token, user, role, isFirstLogin } = res.data;

      // ✅ SAVE AUTH
      login(token, { ...user, role });

      // 🔐 FIRST LOGIN → FORCE PASSWORD CHANGE
      if (isFirstLogin) {
        navigate("/change-password", { replace: true });
        return;
      }

      // ✅ SINGLE DASHBOARD FOR ALL ROLES
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR 👉", err);
      setError(err.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div style={page}>
      <img src={bg} alt="Background" style={bgImage} />

      <div style={overlay}>
        <div style={content}>
          <h1 style={welcome}>Hello Welcome</h1>
          <p style={subtitle}>Association System</p>

          <form onSubmit={handleLogin} style={box}>
            <h3 style={{ marginBottom: 15 }}>Login</h3>

            {/* 🔁 SESSION EXPIRED MESSAGE */}
            {expired && (
              <p style={expiredText}>
                Session expired. Please login again.
              </p>
            )}

            {error && <p style={errorText}>{error}</p>}

            <input
              type="text"
              placeholder="Username / Member ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={input}
              autoComplete="username"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={input}
              autoComplete="current-password"
            />

            <button type="submit" style={btn} disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <p style={{ marginTop: 12 }}>
              <a href="/forgot-password" style={{ color: "#ffd700" }}>
                Forgot Password?
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  minHeight: "100vh",
  position: "relative",
  backgroundColor: "#000",
};

const bgImage = {
  width: "100%",
  height: "auto",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
};

const content = {
  textAlign: "center",
  color: "#fff",
};

const welcome = {
  fontSize: 32,
  fontWeight: "bold",
};

const subtitle = {
  marginBottom: 25,
};

const box = {
  width: 360,
  padding: 24,
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(12px)",
  borderRadius: 14,
};

const input = {
  width: "100%",
  padding: 14,
  marginBottom: 14,
  borderRadius: 8,
  border: "none",
  fontSize: 16,
};

const btn = {
  width: "100%",
  padding: 14,
  background: "gold",
  borderRadius: 10,
  fontWeight: "bold",
  fontSize: 16,
  cursor: "pointer",
  opacity: 1,
};

const errorText = {
  color: "#ffb4b4",
  fontSize: 13,
  marginBottom: 10,
};

const expiredText = {
  color: "#ffe08a",
  fontSize: 13,
  marginBottom: 10,
};
