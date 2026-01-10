import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import bg from "../assets/login-bg.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const [params] = useSearchParams();
  const expired = params.get("expired");

  /* =========================
     PRELOAD BACKGROUND (NO FLICKER)
  ========================= */
  useEffect(() => {
    const img = new Image();
    img.src = bg;
  }, []);

  /* =========================
     HANDLE LOGIN
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, user, role, isFirstLogin } = res.data;

      login(token, { ...user, role });

      navigate(
        isFirstLogin ? "/change-password" : "/dashboard",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={overlay}>
        <div style={card}>
          {/* ===== HEADER ===== */}
          <h1 style={title}>Association System</h1>
          <p style={subtitle}>
            Hinduswaraj Youth Welfare Association
          </p>

          {/* ===== LOGIN FORM ===== */}
          <form onSubmit={handleLogin}>
            {expired && (
              <div style={infoBox}>
                🔒 Session expired. Please login again.
              </div>
            )}

            {error && <div style={errorBox}>{error}</div>}

            <input
              placeholder="Username / Member ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={input}
              autoComplete="username"
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={input}
                autoComplete="current-password"
              />
              <span
                style={eye}
                onClick={() => setShowPwd(!showPwd)}
                title={showPwd ? "Hide Password" : "Show Password"}
              >
                {showPwd ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              type="submit"
              style={btn}
              disabled={loading}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(250,204,21,0.6)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              {loading ? "Authenticating..." : "LOGIN"}
            </button>

            <a href="/forgot-password" style={forgot}>
              Forgot Password?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   🎨 PREMIUM STYLES
===================================================== */

const page = {
  minHeight: "100vh",
  backgroundImage: `
    linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)),
    url(${bg})
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const overlay = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const card = {
  width: 380,
  padding: "38px 32px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 35px 100px rgba(0,0,0,0.9)",
  textAlign: "center",
  animation: "fadeUp 0.7s ease-out",
};

const title = {
  fontFamily: "Georgia, serif",
  fontSize: 28,
  fontWeight: "bold",
  color: "#facc15",
  marginBottom: 6,
};

const subtitle = {
  fontSize: 13,
  color: "#e5e7eb",
  marginBottom: 28,
};

const input = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: 14,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(0,0,0,0.55)",
  color: "#fff",
  fontSize: 15,
  outline: "none",
};

const eye = {
  position: "absolute",
  right: 14,
  top: 14,
  cursor: "pointer",
  fontSize: 18,
};

const btn = {
  width: "100%",
  padding: 14,
  marginTop: 8,
  borderRadius: 12,
  background: "linear-gradient(135deg, #facc15, #eab308)",
  color: "#000",
  fontWeight: "bold",
  fontSize: 16,
  border: "none",
  cursor: "pointer",
  transition: "all .18s ease",
};

const forgot = {
  display: "block",
  marginTop: 16,
  fontSize: 13,
  color: "#fde047",
  textDecoration: "none",
};

const infoBox = {
  background: "rgba(234,179,8,0.25)",
  color: "#fde68a",
  padding: 10,
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 12,
};

const errorBox = {
  background: "rgba(220,38,38,0.25)",
  color: "#fecaca",
  padding: 10,
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 12,
};

/* =====================================================
   🎬 ANIMATION
===================================================== */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
`;
document.head.appendChild(style);
