import { useState } from "react";
import api from "../api/api";

export default function VerifyOtp() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", {
        username,
        otp,
        newPassword,
      });

      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Verify OTP</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submit} style={{ maxWidth: 300 }}>
        <input
          placeholder="Association ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={input}
        />

        <button type="submit" style={btn}>Reset Password</button>
      </form>
    </div>
  );
}

const input = { width: "100%", padding: 10, marginBottom: 10 };
const btn = { width: "100%", padding: 10 };
