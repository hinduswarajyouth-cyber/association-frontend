import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/login-bg.png";

/* ✅ DASHBOARD ROLES */
const dashboardRoles = [
  "EC_MEMBER",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
  "MEMBER",
  "VOLUNTEER",
  "VICE_PRESIDENT",
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      /* ✅ STORE AUTH DATA */
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      /* ✅ FIRST LOGIN CHECK */
      const isFirstLogin =
        data.isFirstLogin === true || data?.user?.is_first_login === true;

      if (isFirstLogin) {
        navigate("/change-password");
        return;
      }

      /* ✅ ROLE BASED ROUTING */
      const role = data.role;

      if (["SUPER_ADMIN", "PRESIDENT"].includes(role)) {
        navigate("/admin-dashboard");
      } else if (role === "TREASURER") {
        navigate("/treasurer-dashboard");
      } else if (dashboardRoles.includes(role)) {
        navigate("/dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      console.error("LOGIN ERROR 👉", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      {/* ✅ BACKGROUND IMAGE */}
      <img src={bg} alt="Background" style={bgImage} />

      {/* ✅ OVERLAY */}
      <div style={overlay}>
        <div style={content}>
          <h1 style={welcome}>Hello Welcome</h1>
          <p style={subtitle}>Association System</p>

          <form onSubmit={handleLogin} style={box}>
            <h3 style={{ marginBottom: 15 }}>Login</h3>

            {error && <p style={errorText}>{error}</p>}

            <input
              type="text"
              placeholder="Association ID (example: ramesh@hsy.org)"
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

            <p style={{ marginTop: 10 }}>
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

/* ===== STYLES ===== */

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
  top: 0,
  left: 0,
  width: "100%",
  minHeight: "100vh",
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const content = {
  textAlign: "center",
  color: "#fff",
};

const welcome = {
  fontSize: 38,
  fontWeight: "bold",
  textShadow: "0 2px 6px rgba(0,0,0,0.8)",
};

const subtitle = {
  marginBottom: 25,
  opacity: 0.95,
};

const box = {
  width: 320,
  padding: 25,
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(10px)",
  borderRadius: 12,
  boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "none",
};

const btn = {
  width: "100%",
  padding: 12,
  background: "gold",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer",
};

const errorText = {
  color: "#ffb4b4",
  fontSize: 13,
  marginBottom: 8,
};
