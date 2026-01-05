import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [active, setActive] = useState(true);
  const [username, setUsername] = useState("");

  /* =========================
     FETCH MEMBER DETAILS
  ========================= */
  useEffect(() => {
    api
      .get(`/admin/member/${id}`)
      .then((res) => {
        const m = res.data;
        setName(m.name || "");
        setPersonalEmail(m.personal_email || "");
        setPhone(m.phone || "");
        setRole(m.role || "MEMBER");
        setActive(Boolean(m.active));
        setUsername(m.username || "");
      })
      .catch(() => {
        alert("Failed to load member");
        navigate("/members");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  /* =========================
     UPDATE MEMBER DETAILS
  ========================= */
  const handleUpdateMember = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/edit-member/${id}`, {
        name,
        personal_email: personalEmail || null,
        phone: phone || null,
        role,
        active,
      });

      alert("✅ Member updated successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     UPDATE ASSOCIATION ID
  ========================= */
  const handleUpdateAssociationId = async () => {
    if (!username.endsWith("@hsy.org")) {
      alert("Association ID must end with @hsy.org");
      return;
    }

    try {
      await api.put(`/admin/edit-association-id/${id}`, { username });
      alert("✅ Association ID updated successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update Association ID");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 30 }}>Loading...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2>Edit Member</h2>

        {/* ===== BASIC DETAILS ===== */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          type="email"
          placeholder="Personal Email"
          value={personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
        />

        {/* ===== ASSOCIATION ID ===== */}
        <label style={label}>Association ID</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="example@hsy.org"
          style={input}
        />

        <button onClick={handleUpdateAssociationId} style={secondaryBtn}>
          Update Association ID
        </button>

        {/* ===== ROLE ===== */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={input}
        >
          <option value="MEMBER">MEMBER</option>
          <option value="TREASURER">TREASURER</option>
          <option value="PRESIDENT">PRESIDENT</option>
          <option value="VICE_PRESIDENT">VICE PRESIDENT</option>
          <option value="GENERAL_SECRETARY">GENERAL SECRETARY</option>
          <option value="JOINT_SECRETARY">JOINT SECRETARY</option>
          <option value="EC_MEMBER">EC MEMBER</option>
        </select>

        {/* ===== ACTIVE ===== */}
        <label style={label}>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />{" "}
          Active
        </label>

        {/* ===== SAVE ===== */}
        <button onClick={handleUpdateMember} disabled={saving} style={btn}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */

const container = {
  padding: 30,
  maxWidth: 450,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
};

const label = {
  fontWeight: "bold",
  marginBottom: 6,
  display: "block",
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#1976d2",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginTop: 10,
};

const secondaryBtn = {
  width: "100%",
  padding: 10,
  background: "#455a64",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginBottom: 15,
};
