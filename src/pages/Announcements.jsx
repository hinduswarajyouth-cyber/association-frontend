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
      const res = await api.get("/api/announcements"); // ✅ FIX
      const today = new Date();

      const valid = res.data.filter(
        a => !a.expiry_date || new Date(a.expiry_date) >= today
      );

      valid.sort((a, b) =>
        a.priority === "PINNED" ? -1 : 1
      );

      setAnnouncements(valid);
    } catch (err) {
      console.error("LOAD ANNOUNCEMENTS ERROR 👉", err);
    }
  };

  /* =========================
     CREATE / UPDATE
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
    };

    try {
      if (editId) {
        await api.put(`/api/announcements/${editId}`, payload); // ✅ FIX
        setSuccess("✅ Announcement updated");
      } else {
        await api.post("/api/announcements", payload); // ✅ FIX
        setSuccess("✅ Announcement published");
      }

      resetForm();
      loadAnnouncements();
    } catch (err) {
      alert("Failed to save announcement");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const deleteAnnouncement = async id => {
    if (!window.confirm("Delete announcement?")) return;
    await api.delete(`/api/announcements/${id}`); // ✅ FIX
    loadAnnouncements();
  };

  /* =========================
     EDIT
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
     MARK AS SEEN
  ========================= */
  const markAsSeen = async id => {
    try {
      await api.post(`/api/announcements/${id}/seen`); // ✅ FIX
      setAnnouncements(prev =>
        prev.map(a =>
          a.id === id ? { ...a, seen: true } : a
        )
      );
    } catch (err) {
      console.error("SEEN ERROR 👉", err);
    }
  };

  const unreadCount = announcements.filter(a => !a.seen).length;

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <div className="container">
      <Navbar />

      <div style={{ float: "right", fontSize: "18px" }}>
        🔔 {unreadCount}
      </div>

      <h2>📢 Announcements</h2>

      {isAdmin && (
        <form onSubmit={submitAnnouncement}>
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

          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="GENERAL">General</option>
            <option value="FINANCE">Finance</option>
            <option value="EVENT">Event</option>
            <option value="ALERT">Alert</option>
          </select>

          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="NORMAL">Normal</option>
            <option value="PINNED">📌 Pinned</option>
          </select>

          <input
            type="date"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
          />

          <button type="submit">{editId ? "Update" : "Publish"}</button>
          {editId && <button onClick={resetForm}>Cancel</button>}
        </form>
      )}

      {announcements.map(a => (
        <div
          key={a.id}
          onClick={() => !a.seen && markAsSeen(a.id)}
          style={{
            background: a.seen ? "#f9f9f9" : "#e8f4ff",
            marginBottom: 10,
            padding: 10,
            cursor: "pointer"
          }}
        >
          <h4>
            {!a.seen && "🔵 "}
            {a.priority === "PINNED" && "📌 "} {a.title}
          </h4>
          <p>{a.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
