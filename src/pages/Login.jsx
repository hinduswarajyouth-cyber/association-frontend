import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import bg from "../assets/login-bg.png";

/* =========================
   LOGIN PAGE
========================= */
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
      // 🔐 CALL LOGIN API
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      /**
       * EXPECTED RESPONSE:
       * {
       *   token,
       *   role,
       *   isFirstLogin,
       *   user: { id, name, username }
       * }
       */
      const { token, user, role, isFirstLogin } = res.data;

      // ✅ FINAL USER OBJECT
      const finalUser = {
        ...user,
        role,
      };

      // ✅ SAVE TOKEN + USER
      login(token, finalUser);

      // 🔁 FORCE PASSWORD CHANGE (FIRST LOGIN)
      if (isFirstLogin) {
        navigate("/change-password", { replace: true });
        return;
      }

      // 🔁 ROLE BASED REDIRECT (MATCH BACKEND)
      if (
        [
          "SUPER_ADMIN",
          "PRESIDENT",
          "VICE_PRESIDENT",
          "GENERAL_SECRETARY",
          "JOINT_SECRETARY",
          "EC_MEMBER",
        ].includes(role)
      ) {
        navigate("/dashboard", { replace: true });
      } else if (role === "TREASURER") {
        navigate("/treasurer", { replace: true });
      } else {
        // MEMBER / VOLUNTEER
        navigate("/member", { replace: true });
      }

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
          <h1 style={welcome}>Hello Welcome</h1>
          <p style={subtitle}>Association System</p>

          <form onSubmit={handleLogin} style={box}>
            <h3 style={{ marginBottom: 15 }}>Login</h3>

            {error && <p style={errorText}>{error}</p>}

            <input
              type="text"
              placeholder="Username / Association ID"
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
};

const errorText = {
  color: "#ffb4b4",
  fontSize: 13,
  marginBottom: 10,
};
