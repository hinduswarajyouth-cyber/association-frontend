import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import bg from "../assets/login-bg.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /* =========================
     HANDLE LOGIN
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, user, isFirstLogin } = res.data;

      // ✅ SAVE AUTH (SINGLE SOURCE OF TRUTH)
      login(token, user);

      // 🔁 FORCE PASSWORD CHANGE ON FIRST LOGIN
      if (isFirstLogin || user?.is_first_login) {
        navigate("/change-password", { replace: true });
        return;
      }

      // ✅ SINGLE REDIRECT (PrivateRoute HANDLES ROLE)
      navigate("/", { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR 👉", err);
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <img src={bg} alt="Background" style={bgImage} />

      <div style={overlay}>
        <div style={content}>
          <div style={animatedBox}>
            <h1 style={welcome}>Hello Welcome</h1>
            <p style={subtitle}>Association System</p>

            <form onSubmit={handleLogin} style={box}>
              <h3 style={{ marginBottom: 15 }}>Login</h3>

              {error && <p style={errorText}>{error}</p>}

              <input
                type="text"
                placeholder="Association ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={input}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={input}
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
    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */

const page = {
  minHeight: "100vh",
  position: "relative",
  backgroundColor: "#000",
};

const bgImage = {
  width: "100%",
  height: "auto",
  display: "block",
};

const overlay = {
  position: "absolute",
  inset: 0,
  minHeight: "100svh",
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px 16px",
};

const content = {
  textAlign: "center",
  color: "#fff",
};

const animatedBox = {
  animation: "fadeSlide 0.8s ease-out",
};

/* inject keyframes safely */
if (typeof document !== "undefined") {
  const sheet = document.styleSheets?.[0];
  if (sheet) {
    try {
      sheet.insertRule(
        `
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `,
        sheet.cssRules.length
      );
    } catch {}
  }
}

const welcome = {
  fontSize: 32,
  fontWeight: "bold",
  marginBottom: 4,
};

const subtitle = {
  marginBottom: 25,
  opacity: 0.95,
};

const box = {
  width: "100%",
  maxWidth: 360,
  padding: 24,
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(12px)",
  borderRadius: 14,
  boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
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
};

const errorText = {
  color: "#ffb4b4",
  fontSize: 13,
  marginBottom: 10,
};
