import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Announcements = () => {
  const role = localStorage.getItem("role");
  const isAdmin = role === "SUPER_ADMIN" || role === "PRESIDENT";

  // Form states
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [priority, setPriority] = useState("NORMAL");
  const [expiry, setExpiry] = useState("");
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");

  // Data
  const [announcements, setAnnouncements] = useState([]);

  /* =========================
     LOAD ANNOUNCEMENTS
  ========================= */
  const loadAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      const today = new Date();

      // filter expired
      const valid = res.data.filter(a =>
        !a.expiry_date || new Date(a.expiry_date) >= today
      );

      // pinned first
      valid.sort((a, b) =>
        a.priority === "PINNED" ? -1 : 1
      );

      setAnnouncements(valid);
    } catch (err) {
      console.error("LOAD ANNOUNCEMENTS ERROR 👉", err);
    }
  };

  /* =========================
     CREATE / UPDATE (ADMIN)
     + NOTIFICATION TRIGGER
  ========================= */
  const submitAnnouncement = async e => {
    e.preventDefault();
    setSuccess("");

    if (!title || !message) {
      return alert("Title & message required");
    }

    const payload = {
      title,
      message,
      category,
      priority,
      expiry_date: expiry || null,
      notify: true // 🔔 email / WhatsApp trigger
    };

    try {
      if (editId) {
        await api.put(`/announcements/${editId}`, payload);
        setSuccess("✅ Announcement updated");
      } else {
        await api.post("/announcements", payload);
        setSuccess("✅ Announcement published & notifications sent");
      }

      resetForm();
      loadAnnouncements();
    } catch (err) {
      alert("Failed to save announcement");
    }
  };

  /* =========================
     DELETE (ADMIN)
  ========================= */
  const deleteAnnouncement = async id => {
    if (!window.confirm("Delete announcement?")) return;
    await api.delete(`/announcements/${id}`);
    loadAnnouncements();
  };

  /* =========================
     EDIT MODE (ADMIN)
  ========================= */
  const editAnnouncement = a => {
    setEditId(a.id);
    setTitle(a.title);
    setMessage(a.message);
    setCategory(a.category || "GENERAL");
    setPriority(a.priority || "NORMAL");
    setExpiry(a.expiry_date ? a.expiry_date.split("T")[0] : "");
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setMessage("");
    setCategory("GENERAL");
    setPriority("NORMAL");
    setExpiry("");
  };

  /* =========================
     MARK AS SEEN (MEMBER)
  ========================= */
  const markAsSeen = async id => {
    try {
      await api.post(`/announcements/${id}/seen`);
      setAnnouncements(prev =>
        prev.map(a =>
          a.id === id ? { ...a, seen: true } : a
        )
      );
    } catch (err) {
      console.error("SEEN ERROR 👉", err);
    }
  };

  /* =========================
     NOTIFICATION COUNT
  ========================= */
  const unreadCount = announcements.filter(a => !a.seen).length;

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <div className="container">

      {/* 🔔 Notification Bell */}
      <div style={{ float: "right", fontSize: "18px" }}>
        🔔 {unreadCount}
      </div>

      <h2>📢 Announcements</h2>

      {/* ================= ADMIN FORM ================= */}
      {isAdmin && (
        <form onSubmit={submitAnnouncement} style={{ marginBottom: 30 }}>
          <h3>{editId ? "✏️ Edit" : "➕ New"} Announcement</h3>

          {success && <p style={{ color: "green" }}>{success}</p>}

          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Message"
            rows="4"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />

          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="GENERAL">General</option>
            <option value="FINANCE">Finance</option>
            <option value="EVENT">Event</option>
            <option value="ALERT">Alert</option>
          </select>

          <label>Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="NORMAL">Normal</option>
            <option value="PINNED">📌 Pinned</option>
          </select>

          <label>Expiry Date (optional)</label>
          <input
            type="date"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
          />

          <button type="submit">
            {editId ? "Update" : "Publish"}
          </button>

          {editId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      )}

      {/* ================= DASHBOARD PINNED HIGHLIGHT ================= */}
      {announcements
        .filter(a => a.priority === "PINNED")
        .slice(0, 1)
        .map(a => (
          <div
            key={a.id}
            style={{
              background: "#fff3cd",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px"
            }}
          >
            📌 <b>{a.title}</b> — {a.message}
          </div>
        ))}

      {/* ================= ANNOUNCEMENT LIST ================= */}
      {announcements.length === 0 && <p>No announcements yet</p>}

      {announcements.map(a => (
        <div
          key={a.id}
          onClick={() => !a.seen && markAsSeen(a.id)}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderLeft:
              a.priority === "PINNED"
                ? "5px solid red"
                : "5px solid gray",
            background: a.seen ? "#f9f9f9" : "#e8f4ff",
            cursor: "pointer"
          }}
        >
          <h4>
            {!a.seen && "🔵 "}
            {a.priority === "PINNED" && "📌 "} {a.title}
          </h4>

          <small>
            📂 {a.category} | 📅{" "}
            {new Date(a.created_at).toLocaleDateString()}
            {a.expiry_date && (
              <> | ⏰ Expires: {new Date(a.expiry_date).toLocaleDateString()}</>
            )}
          </small>

          <p>{a.message}</p>

          {!a.seen && (
            <small style={{ color: "blue" }}>
              👁 Click to mark as seen
            </small>
          )}

          {/* ADMIN ACTIONS */}
          {isAdmin && (
            <div>
              <button onClick={() => editAnnouncement(a)}>Edit</button>
              <button onClick={() => deleteAnnouncement(a.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Announcements;
