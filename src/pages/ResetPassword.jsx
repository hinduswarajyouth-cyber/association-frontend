import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const resetPassword = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div style={box}>
      <h2>Reset Password</h2>

      <form onSubmit={resetPassword}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={input}
        />

        <button style={btn}>Reset Password</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}

const box = { maxWidth: 400, margin: "80px auto", padding: 20 };
const input = { width: "100%", padding: 10, marginBottom: 12 };
const btn = { width: "100%", padding: 10 };
