import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  /* ===== TIMER ===== */
  const [timer, setTimer] = useState(0);

  /* =========================
     OTP TIMER EFFECT
  ========================= */
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /* =========================
     STEP 1: SEND OTP
  ========================= */
  const sendOtp = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Association ID is required");
      return;
    }

    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", {
        username: username.trim(),
      });

      setMsg(res.data.message || "OTP sent to registered email");
      setOtpSent(true);
      setTimer(60); // 🔥 START 60s TIMER
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 2: VERIFY OTP
  ========================= */
  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        username,
        otp,
      });

      setMsg(res.data.message || "OTP verified successfully");
      setOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 3: RESET PASSWORD
  ========================= */
  const resetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        username,
        newPassword,
      });

      setMsg(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Forgot Password</h2>
        <p style={subtitle}>
          Securely reset your password using OTP verification
        </p>

        <div style={stepIndicator}>
          {!otpSent && "Step 1 of 3 · Send OTP"}
          {otpSent && !otpVerified && "Step 2 of 3 · Verify OTP"}
          {otpVerified && "Step 3 of 3 · Reset Password"}
        </div>

        {error && <div style={errorBox}>{error}</div>}
        {msg && <div style={successBox}>{msg}</div>}

        {/* ===== STEP 1 ===== */}
        {!otpSent && (
          <form onSubmit={sendOtp}>
            <div style={field}>
              <label style={label}>Association ID</label>
              <input
                placeholder="admin@hsy.org"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={input}
              />
            </div>

            <button style={primaryBtn} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ===== STEP 2 ===== */}
        {otpSent && !otpVerified && (
          <form onSubmit={verifyOtp}>
            <div style={field}>
              <label style={label}>Association ID</label>
              <input value={username} disabled style={inputDisabled} />
            </div>

            <div style={field}>
              <label style={label}>OTP</label>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={input}
              />
            </div>

            <button style={primaryBtn} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* ===== TIMER / RESEND ===== */}
            <div style={timerText}>
              {timer > 0
                ? `Resend OTP in 00:${timer.toString().padStart(2, "0")}`
                : "Didn’t receive OTP?"}
            </div>

            <button
              type="button"
              onClick={sendOtp}
              disabled={timer > 0 || loading}
              style={{
                ...resendBtn,
                opacity: timer > 0 ? 0.5 : 1,
                cursor: timer > 0 ? "not-allowed" : "pointer",
              }}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* ===== STEP 3 ===== */}
        {otpVerified && (
          <form onSubmit={resetPassword}>
            <div style={field}>
              <label style={label}>Association ID</label>
              <input value={username} disabled style={inputDisabled} />
            </div>

            <div style={field}>
              <label style={label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={input}
              />
            </div>

            <div style={field}>
              <label style={label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={input}
              />
            </div>

            <button style={primaryBtn} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div style={footer}>
          Remembered your password?{" "}
          <span style={link} onClick={() => navigate("/")}>
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES – PROFESSIONAL
========================= */

const page = {
  minHeight: "100vh",
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Inter, Segoe UI, sans-serif",
};

const card = {
  background: "#ffffff",
  width: 420,
  padding: 32,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const title = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0f172a",
};

const subtitle = {
  fontSize: 13,
  color: "#64748b",
  marginBottom: 10,
};

const stepIndicator = {
  fontSize: 12,
  color: "#475569",
  background: "#f1f5f9",
  padding: "6px 10px",
  borderRadius: 6,
  marginBottom: 14,
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
};

const inputDisabled = {
  ...input,
  background: "#f1f5f9",
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
};

const resendBtn = {
  width: "100%",
  padding: "10px",
  marginTop: 6,
  borderRadius: 8,
  border: "1px solid #2563eb",
  background: "#fff",
  color: "#2563eb",
  fontSize: 14,
  fontWeight: 600,
};

const timerText = {
  marginTop: 10,
  fontSize: 12,
  color: "#64748b",
  textAlign: "center",
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

const footer = {
  marginTop: 18,
  fontSize: 12,
  color: "#64748b",
  textAlign: "center",
};

const link = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: 600,
};
