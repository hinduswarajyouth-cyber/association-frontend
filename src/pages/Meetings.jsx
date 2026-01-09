import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   🔐 ROLE FROM JWT
========================= */
const getRole = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    return null;
  }
};

const ROLE = getRole();
const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_date: "",
    location: "",
    join_link: "",
    is_public: false,
  });

  const [chat, setChat] = useState([]);
  const [chatMsg, setChatMsg] = useState("");

  const [resolutions, setResolutions] = useState([]);
  const [resolutionTitle, setResolutionTitle] = useState("");

  const [tasks, setTasks] = useState([]);

  /* =========================
     LOAD MEETINGS
  ========================= */
  const loadMeetings = async () => {
    try {
      const res = await api.get("/meetings");
      setMeetings(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  /* =========================
     CREATE / UPDATE
  ========================= */
  const saveMeeting = async () => {
    if (!form.title || !form.meeting_date) {
      alert("Title & date required");
      return;
    }

    if (selected) {
      await api.put(`/meetings/${selected.id}`, form);
    } else {
      await api.post("/meetings/create", form);
    }

    resetForm();
    loadMeetings();
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      meeting_date: "",
      location: "",
      join_link: "",
      is_public: false,
    });
    setSelected(null);
  };

  /* =========================
     DELETE
  ========================= */
  const deleteMeeting = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    await api.delete(`/meetings/${id}`);
    loadMeetings();
  };

  /* =========================
     ATTENDANCE
  ========================= */
  const markAttendance = async (id, status) => {
    await api.post(`/meetings/attendance/${id}`, { status });
    alert("Attendance recorded");
  };

  /* =========================
     CHAT
  ========================= */
  const loadChat = async (id) => {
    const res = await api.get(`/meetings/chat/${id}`);
    setChat(res.data || []);
  };

  const sendChat = async () => {
    if (!chatMsg) return;
    await api.post(`/meetings/chat/${selected.id}`, { message: chatMsg });
    setChatMsg("");
    loadChat(selected.id);
  };

  /* =========================
     RESOLUTIONS / VOTING
  ========================= */
  const loadResolutions = async (id) => {
    const res = await api.get(`/meetings/resolution/${id}`);
    setResolutions(res.data || []);
  };

  const createResolution = async () => {
    await api.post(`/meetings/resolution/${selected.id}`, {
      title: resolutionTitle,
    });
    setResolutionTitle("");
    loadResolutions(selected.id);
  };

  const vote = async (rid, vote) => {
    await api.post(`/meetings/vote/${rid}`, { vote });
    alert("Vote submitted");
  };

  /* =========================
     TASKS
  ========================= */
  const loadTasks = async (id) => {
    const res = await api.get(`/meetings/tasks/${id}`);
    setTasks(res.data || []);
  };

  const updateTask = async (tid, status) => {
    await api.put(`/meetings/tasks/status/${tid}`, { status });
    loadTasks(selected.id);
  };

  /* =========================
     OPEN MEETING
  ========================= */
  const openMeeting = (m) => {
    setSelected(m);
    setForm(m);
    loadChat(m.id);
    loadTasks(m.id);
    loadResolutions(m.id);
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2 style={title}>📅 Meetings & Online Participation</h2>

        {/* ================= CREATE / EDIT ================= */}
        {ADMIN_ROLES.includes(ROLE) && (
          <div style={card}>
            <h3>{selected ? "Edit Meeting" : "Create Meeting"}</h3>

            <div style={grid2}>
              <input style={input} placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input type="datetime-local" style={input}
                value={form.meeting_date}
                onChange={(e) => setForm({ ...form, meeting_date: e.target.value })}
              />
              <input style={input} placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <input style={input} placeholder="Join Link (Zoom / Meet)"
                value={form.join_link}
                onChange={(e) => setForm({ ...form, join_link: e.target.value })}
              />
            </div>

            <textarea style={textarea} placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <label>
              <input type="checkbox"
                checked={form.is_public}
                onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
              /> Public Meeting
            </label>

            <div style={row}>
              <button style={btnPrimary} onClick={saveMeeting}>Save</button>
              {selected && (
                <button style={btnSecondary} onClick={resetForm}>Cancel</button>
              )}
            </div>
          </div>
        )}

        {/* ================= MEETING LIST ================= */}
        {loading && <p>Loading...</p>}

        <div style={grid}>
          {meetings.map((m) => (
            <div key={m.id} style={card}>
              <h4>{m.title}</h4>
              <p style={muted}>{m.description}</p>
              <p><b>Date:</b> {new Date(m.meeting_date).toLocaleString()}</p>
              <p><b>Location:</b> {m.location || "-"}</p>

              {m.join_link && (
                <a href={m.join_link} target="_blank" rel="noreferrer">
                  🔗 Join Online
                </a>
              )}

              {ROLE === "MEMBER" && (
                <div style={row}>
                  <button style={btnSuccess} onClick={() => markAttendance(m.id, "PRESENT")}>Present</button>
                  <button style={btnDanger} onClick={() => markAttendance(m.id, "ABSENT")}>Absent</button>
                </div>
              )}

              <div style={row}>
                <button style={btnSecondary} onClick={() => openMeeting(m)}>Open</button>
                {ROLE === "SUPER_ADMIN" && (
                  <button style={btnDanger} onClick={() => deleteMeeting(m.id)}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= DETAILS ================= */}
        {selected && (
          <div style={card}>
            <h3>🧩 {selected.title}</h3>

            {/* CHAT */}
            <h4>💬 Chat</h4>
            <div style={chatBox}>
              {chat.map((c, i) => (
                <p key={i}><b>{c.name}:</b> {c.message}</p>
              ))}
            </div>
            <input style={input} placeholder="Message"
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
            />
            <button style={btnPrimary} onClick={sendChat}>Send</button>

            {/* RESOLUTIONS */}
            <h4>🗳 Resolutions</h4>
            {ADMIN_ROLES.includes(ROLE) && (
              <>
                <input style={input} placeholder="Resolution title"
                  value={resolutionTitle}
                  onChange={(e) => setResolutionTitle(e.target.value)}
                />
                <button style={btnPrimary} onClick={createResolution}>Create</button>
              </>
            )}

            {resolutions.map((r) => (
              <div key={r.id} style={row}>
                <span>{r.title}</span>
                <button style={btnSuccess} onClick={() => vote(r.id, "YES")}>YES</button>
                <button style={btnDanger} onClick={() => vote(r.id, "NO")}>NO</button>
              </div>
            ))}

            {/* TASKS */}
            <h4>📌 Tasks</h4>
            {tasks.map((t) => (
              <div key={t.id} style={row}>
                <span>{t.title}</span>
                {t.assigned_to === selected.user_id && (
                  <select
                    value={t.status}
                    onChange={(e) => updateTask(t.id, e.target.value)}
                  >
                    <option>PENDING</option>
                    <option>IN_PROGRESS</option>
                    <option>COMPLETED</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* =========================
   🎨 STYLES
========================= */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const title = { fontSize: 26, fontWeight: 700, marginBottom: 20 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const card = { background: "#fff", padding: 20, borderRadius: 12, marginBottom: 20 };
const input = { padding: 10, borderRadius: 8, border: "1px solid #cbd5f5", width: "100%" };
const textarea = { width: "100%", height: 80, padding: 10, borderRadius: 8, border: "1px solid #cbd5f5" };
const row = { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" };
const chatBox = { maxHeight: 150, overflowY: "auto", background: "#f8fafc", padding: 10, borderRadius: 6 };
const muted = { color: "#64748b" };

const btnPrimary = { background: "#2563eb", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 6 };
const btnSecondary = { background: "#0f172a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 6 };
const btnSuccess = { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6 };
const btnDanger = { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6 };
