import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   🔐 USER FROM JWT
========================= */
const getUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
};

const { role: ROLE } = getUser();
const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];

/* =========================
   DATE FIX
========================= */
const toDateTimeLocal = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_date: "",
    location: "",
    join_link: "",
    is_public: false,
  });

  /* ================= CHAT ================= */
  const [chat, setChat] = useState([]);
  const [chatMsg, setChatMsg] = useState("");

  /* ================= RESOLUTIONS ================= */
  const [resolutions, setResolutions] = useState([]);
  const [resolutionTitle, setResolutionTitle] = useState("");

  /* ================= FILE UPLOAD & DOWNLOAD ================= */
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("AGENDA");
  const [files, setFiles] = useState([]);

  /* ================= LOAD MEETINGS ================= */
  const loadMeetings = async () => {
    const res = await api.get("/meetings/my");
    setMeetings(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const saveMeeting = async () => {
    if (!form.title || !form.meeting_date) {
      alert("Title & Date required");
      return;
    }

    selected
      ? await api.put(`/meetings/${selected.id}`, form)
      : await api.post("/meetings/create", form);

    resetForm();
    loadMeetings();
  };

  const resetForm = () => {
    setSelected(null);
    setForm({
      title: "",
      description: "",
      meeting_date: "",
      location: "",
      join_link: "",
      is_public: false,
    });
  };

  /* ================= CHAT ================= */
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

  /* ================= RESOLUTIONS ================= */
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

  /* ================= FILE UPLOAD ================= */
  const uploadFile = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", fileType);

    await api.post(`/meetings/files/${selected.id}`, fd);
    alert("File uploaded");
    setFile(null);
    loadFiles(selected.id);
  };

  /* ================= FILE DOWNLOAD ================= */
  const loadFiles = async (id) => {
    const res = await api.get(`/meetings/files/${id}`);
    setFiles(res.data || []);
  };

  /* ================= OPEN MEETING ================= */
  const openMeeting = async (m) => {
    setSelected(m);
    setForm({
      ...m,
      meeting_date: toDateTimeLocal(m.meeting_date),
    });
    loadChat(m.id);
    loadResolutions(m.id);
    loadFiles(m.id);
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />
      <div style={page}>
        <h2 style={title}>📅 Meetings</h2>

        {/* CREATE / EDIT */}
        {ADMIN_ROLES.includes(ROLE) && (
          <div style={card}>
            <h3>{selected ? "Edit Meeting" : "Create Meeting"}</h3>

            <div style={grid2}>
              <input style={input} placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
              <input type="datetime-local" style={input}
                value={form.meeting_date}
                onChange={e => setForm({ ...form, meeting_date: e.target.value })} />
            </div>

            <textarea style={textarea} placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />

            <button style={btnPrimary} onClick={saveMeeting}>Save</button>
          </div>
        )}

        {/* LIST */}
        {loading && <p>Loading...</p>}
        <div style={grid}>
          {meetings.map(m => (
            <div key={m.id} style={card}>
              <h4>{m.title}</h4>
              <p>{new Date(m.meeting_date).toLocaleString()}</p>
              <button style={btnSecondary} onClick={() => openMeeting(m)}>Open</button>
            </div>
          ))}
        </div>

        {/* DETAILS */}
        {selected && (
          <div style={card}>
            <h3>🧩 {selected.title}</h3>

            <h4>📎 Agenda / Minutes</h4>

            {ADMIN_ROLES.includes(ROLE) && (
              <>
                <input type="file" onChange={e => setFile(e.target.files[0])} />
                <select onChange={e => setFileType(e.target.value)}>
                  <option value="AGENDA">Agenda</option>
                  <option value="MINUTES">Minutes</option>
                </select>
                <button style={btnPrimary} onClick={uploadFile}>Upload</button>
              </>
            )}

            {files.length === 0 && <p>No files uploaded</p>}

            {files.map(f => (
              <div key={f.id} style={fileRow}>
                <div>
                  <b>{f.file_type}</b>
                  <div style={{ fontSize: 12 }}>
                    {new Date(f.created_at).toLocaleString()}
                  </div>
                </div>
                <a
                  href={`https://api.hinduswarajyouth.online/${f.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  style={downloadBtn}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ================= STYLES ================= */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const title = { fontSize: 26, fontWeight: 700 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const card = { background: "#fff", padding: 20, borderRadius: 12, marginBottom: 20 };
const input = { padding: 10, borderRadius: 8, border: "1px solid #cbd5f5", width: "100%" };
const textarea = { width: "100%", height: 80, padding: 10, borderRadius: 8, border: "1px solid #cbd5f5" };
const btnPrimary = { background: "#2563eb", color: "#fff", padding: "8px 14px", border: "none", borderRadius: 6 };
const btnSecondary = { background: "#0f172a", color: "#fff", padding: "8px 14px", border: "none", borderRadius: 6 };

const fileRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e5e7eb",
  padding: "8px 0",
};

const downloadBtn = {
  background: "#16a34a",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  textDecoration: "none",
};
