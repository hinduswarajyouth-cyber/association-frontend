import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess("Password changed successfully. Please login again.");

      // auto logout after password change
      setTimeout(() => {
        localStorage.clear();
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== NAVBAR (Dashboard + Logout here only) ===== */}
      <Navbar />

      <div style={page}>
        <div style={card}>
          <h2 style={title}>Change Password</h2>

          <p style={subtitle}>
            Update your password to keep your account secure
          </p>

          <div style={securityNote}>
            Password must be at least 8 characters long.
          </div>

          {/* ===== MESSAGES ===== */}
          {error && <div style={errorBox}>{error}</div>}
          {success && <div style={successBox}>{success}</div>}

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit}>
            <div style={field}>
              <label style={label}>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={input}
                placeholder="Enter current password"
                required
              />
            </div>

            <div style={field}>
              <label style={label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={input}
                placeholder="Enter new password"
                required
              />
            </div>

            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* =========================
   STYLES – PROFESSIONAL & CLEAN
========================= */

const page = {
  minHeight: "calc(100vh - 64px)", // navbar height adjust
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: 40,
  fontFamily: "Inter, Segoe UI, sans-serif",
};

const card = {
  background: "#ffffff",
  width: 420,
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const title = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: 4,
};

const subtitle = {
  fontSize: 13,
  color: "#64748b",
  marginBottom: 10,
};

const securityNote = {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 16,
};

const field = {
  display: "flex",
  flexDirection: "column",
  marginBottom: 16,
};

const label = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: "#334155",
};

const input = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #cbd5f5",
  fontSize: 15,
  outline: "none",
};

const primaryBtn = {
  marginTop: 16,
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px 12px",
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 12,
};

const successBox = {
  background: "#dcfce7",
  color: "#166534",
  padding: "8px 12px",
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 12,
};
