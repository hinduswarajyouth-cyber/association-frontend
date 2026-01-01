import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AddMember() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     ADD MEMBER (FINAL)
  ========================= */
  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Full Name is required");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/admin/add-member",
        {
          name: name.trim(),
          personal_email: personalEmail || null,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(
        "Member added successfully. Login credentials have been sent to the registered email."
      );

      // reset form
      setName("");
      setPersonalEmail("");
      setRole("MEMBER");

      // redirect after short delay
      setTimeout(() => {
        navigate("/members");
      }, 1200);
    } catch (err) {
      console.error("ADD MEMBER ERROR 👉", err);
      setError(err.response?.data?.error || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <div style={card}>
          <h2 style={title}>Add Member</h2>
          <p style={subtitle}>
            Create a new member account for the association
          </p>

          <div style={infoNote}>
            If email is not provided, you can resend login credentials later.
          </div>

          {error && <div style={errorBox}>{error}</div>}
          {success && <div style={successBox}>{success}</div>}

          <form onSubmit={handleAddMember}>
            <div style={field}>
              <label style={label}>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={input}
                placeholder="Enter full name"
                required
              />
            </div>

            <div style={field}>
              <label style={label}>Personal Email (optional)</label>
              <input
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                style={input}
                placeholder="Enter personal email"
              />
            </div>

            <div style={field}>
              <label style={label}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={select}
              >
                <option value="MEMBER">MEMBER</option>
                <option value="EC_MEMBER">EC MEMBER</option>
                <option value="TREASURER">TREASURER</option>
                <option value="PRESIDENT">PRESIDENT</option>
                <option value="VICE_PRESIDENT">VICE PRESIDENT</option>
                <option value="GENERAL_SECRETARY">
                  GENERAL SECRETARY
                </option>
                <option value="JOINT_SECRETARY">
                  JOINT SECRETARY
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* =========================
   STYLES – PROFESSIONAL & CONSISTENT
========================= */

const page = {
  minHeight: "calc(100vh - 64px)",
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: 40,
  fontFamily: "Inter, Segoe UI, sans-serif",
};

const card = {
  background: "#ffffff",
  width: 460,
  padding: 32,
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
  marginBottom: 12,
};

const infoNote = {
  fontSize: 12,
  color: "#475569",
  background: "#f1f5f9",
  padding: "8px 12px",
  borderRadius: 8,
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

const select = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #cbd5f5",
  fontSize: 15,
  outline: "none",
  background: "#fff",
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
