import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Announcements() {
  const { user } = useAuth();

  const isAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "PRESIDENT";

  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [priority, setPriority] = useState("NORMAL");
  const [expiry, setExpiry] = useState("");
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");

  /* =========================
     LOAD (ALL USERS)
  ========================= */
  const loadAnnouncements = async () => {
    try {
      const res = await api.get("/api/announcements");

      const today = new Date();
      const valid = res.data.filter(
        a => !a.expiry_date || new Date(a.expiry_date) >= today
      );

      valid.sort((a, b) =>
        a.priority === "PINNED" ? -1 : 1
      );

      setAnnouncements(valid);
    } catch (err) {
      console.error("LOAD ERROR", err);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  /* =========================
     CREATE / UPDATE (ADMIN)
  ========================= */
  const submitAnnouncement = async e => {
    e.preventDefault();
    setSuccess("");

    const payload = {
      title,
      message,
      category,
      priority,
      expiry_date: expiry || null,
    };

    try {
      if (editId) {
        await api.put(`/api/announcements/${editId}`, payload);
        setSuccess("Updated successfully");
      } else {
        await api.post("/api/announcements", payload);
        setSuccess("Announcement published");
      }

      resetForm();
      loadAnnouncements();
    } catch {
      alert("Save failed");
    }
  };

  const deleteAnnouncement = async id => {
    if (!window.confirm("Delete announcement?")) return;
    await api.delete(`/api/announcements/${id}`);
    loadAnnouncements();
  };

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
     MARK SEEN (ALL USERS)
  ========================= */
  const markAsSeen = async id => {
    await api.post(`/api/announcements/${id}/seen`);
    setAnnouncements(prev =>
      prev.map(a =>
        a.id === id ? { ...a, seen: true } : a
      )
    );
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>📢 Announcements</h2>

        {/* ADMIN FORM */}
        {isAdmin && (
          <form onSubmit={submitAnnouncement}>
            <h3>{editId ? "Edit" : "New"} Announcement</h3>
            {success && <p style={{ color: "green" }}>{success}</p>}

            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" required />

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

            <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
            <button type="submit">{editId ? "Update" : "Publish"}</button>
            {editId && <button type="button" onClick={resetForm}>Cancel</button>}
          </form>
        )}

        {/* LIST – ALL USERS */}
        {announcements.map(a => (
          <div
            key={a.id}
            onClick={() => !a.seen && markAsSeen(a.id)}
            style={{
              background: a.seen ? "#f9f9f9" : "#e8f4ff",
              padding: 12,
              marginBottom: 10,
              borderLeft: a.priority === "PINNED" ? "5px solid red" : "5px solid blue",
              cursor: "pointer",
            }}
          >
            <h4>
              {!a.seen && "🔵 "}
              {a.priority === "PINNED" && "📌 "}
              {a.title}
            </h4>
            <p>{a.message}</p>

            {isAdmin && (
              <>
                <button onClick={() => editAnnouncement(a)}>Edit</button>
                <button onClick={() => deleteAnnouncement(a.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
