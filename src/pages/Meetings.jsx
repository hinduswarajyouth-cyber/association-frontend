import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

/* ===== CHART ===== */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ================= STATUS META ================= */
const MEETING_META = {
  UPCOMING: { color: "#2563eb", icon: "📅" },
  COMPLETED: { color: "#16a34a", icon: "✅" },
};

/* ================= COMPONENT ================= */
const ist = d => new Date(d);

const meetingCountdown = (d) => {
  const diff = ist(d) - new Date();
  if (diff <= 0) return "Started";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
};


const isLive = (d) => {
  const t = ist(d).getTime();
  const now = Date.now();
  return now > t - 15 * 60 * 1000 && now < t + 2 * 60 * 60 * 1000;
};
const smartDay = (d) => {
  const date = new Date(d.replace(" ", "T"));
  const today = new Date();
  const diff = Math.floor((date - today) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";

  return date.toLocaleDateString("en-IN", { weekday: "long" });
};

export default function Meetings() {
  const { user } = useAuth();
  const role = user.role;

  /* ROLE GROUPS */
  const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
  const CAN_VOTE = [
    "EC_MEMBER",
    "VICE_PRESIDENT",
    "GENERAL_SECRETARY",
    "JOINT_SECRETARY",
  ];
  const CAN_DELETE = role === "SUPER_ADMIN";

  /* STATES */
  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [votes, setVotes] = useState({});

  const [attendance, setAttendance] = useState([]);

  const [form, setForm] = useState({
    title: "",
    meeting_date: "",
    description: "",
    join_link: "",
  });

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [deadline, setDeadline] = useState("");

  const [minutesFile, setMinutesFile] = useState(null);
  const [agenda, setAgenda] = useState("");
const [agendaLocked, setAgendaLocked] = useState(false);
const [now, setNow] = useState(Date.now());
const saveAgenda = async () => {
  if (!selected) {
    alert("No meeting selected");
    return;
  }

  try {
    await api.post(`/meetings/agenda/${selected.id}`, {
      agenda,
    });

    const r = await api.get(`/meetings/agenda/${selected.id}`);
    setAgenda(r.data.agenda || "");
    setAgendaLocked(r.data.agenda_locked);

    alert("Agenda saved");
  } catch (err) {
    console.error("Agenda error", err);
    alert(err.response?.data?.error || "Save failed");
  }
};

  /* ================= HELPERS ================= */
  const agendaLockCountdown = (meetingDate) => {
  const lockTime = new Date(meetingDate.replace(" ", "T")).getTime() + 15 * 60 * 1000;
  const diff = lockTime - Date.now();

  if (diff <= 0) return "🔒 Agenda Locked";

  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return `🔓 Locks in ${m}m ${s}s`;
};
  const meetingStatus = (date) => {
  const now = new Date();
  const d = new Date(date.replace(" ", "T"));
  return d > now ? "UPCOMING" : "COMPLETED";
};
const getVoteCount = (rid) => {
  const v = votes[rid] || [];
  let yes = 0, no = 0;

  v.forEach(x => {
    if (x.vote === "YES") yes++;
    if (x.vote === "NO") no++;
  });

  return { yes, no, total: v.length };
};

  /* ================= LOAD ================= */
  const loadMeetings = async () => {
    const res = await api.get("/meetings");
    setMeetings(res.data || []);
  };

  useEffect(() => {
    loadMeetings();
  }, []);
  useEffect(() => {
  const t = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(t);
}, []);

  /* ================= OPEN ================= */
  const openMeeting = async (m) => {
    setSelected(m);
    setEditing(false);

    await api.post(`/meetings/join/${m.id}`).catch(() => {});
    const r = await api.get(`/meetings/resolution/${m.id}`);
    setResolutions(r.data || []);
    const voteMap = {};
for (const res of r.data || []) {
  const vr = await api.get(`/meetings/votes/${res.id}`);
  voteMap[res.id] = vr.data;
}
setVotes(voteMap);



    // OPTIONAL BACKEND: /meetings/attendance/:id
    api.get(`/meetings/attendance/${m.id}`)
      .then(res => setAttendance(res.data || []))
      .catch(() => setAttendance([]));
       // ===== Load Agenda =====
  api.get(`/meetings/agenda/${m.id}`)
    .then(r => {
      setAgenda(r.data.agenda || "");
      setAgendaLocked(r.data.agenda_locked);
    })
    .catch(() => {
      setAgenda("");
      setAgendaLocked(false);
    });
  };

  /* ================= CREATE / UPDATE ================= */
  const saveMeeting = async () => {
    if (!form.title || !form.meeting_date) {
      alert("Title & Date required");
      return;
    }

    const payload = {
  ...form,
  meeting_date: new Date(form.meeting_date).toISOString()
};

if (editing) {
  await api.put(`/meetings/${selected.id}`, payload);
} else {
  await api.post("/meetings/create", payload);
}

    resetForm();
    loadMeetings();
  };

  const resetForm = () => {
    setForm({ title: "", meeting_date: "", description: "", join_link: "" });
    setSelected(null);
    setEditing(false);
  };

  /* ================= DELETE ================= */
  const deleteMeeting = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    await api.delete(`/meetings/${id}`);
    loadMeetings();
  };

  /* ================= VOTE ================= */
  const vote = async (rid, v) => {
  await api.post(`/meetings/vote/${rid}`, { vote: v });

  // reload resolutions
  const r = await api.get(`/meetings/resolution/${selected.id}`);
  setResolutions(r.data || []);

  // reload votes for this resolution
  const vr = await api.get(`/meetings/votes/${rid}`);
  setVotes(prev => ({ ...prev, [rid]: vr.data }));
};

  /* ================= RESOLUTION ================= */
  const addResolution = async () => {
    if (!newTitle || !newContent) return alert("All fields required");

    await api.post(`/meetings/resolution/${selected.id}`, {
      title: newTitle,
      content: newContent,
      vote_deadline: deadline || null,
    });

    setNewTitle("");
    setNewContent("");
    setDeadline("");

    const r = await api.get(`/meetings/resolution/${selected.id}`);
    setResolutions(r.data || []);
  };

  /* ================= MINUTES UPLOAD ================= */
  const uploadMinutes = async () => {
    if (!minutesFile) return alert("Select PDF file");

    const fd = new FormData();
    fd.append("file", minutesFile);

    // OPTIONAL BACKEND: POST /meetings/minutes/:id
    await api.post(`/meetings/minutes/${selected.id}`, fd);
    alert("Minutes uploaded");
  };

  /* ================= DASHBOARD ================= */
  const upcoming = meetings.filter(
    (m) => meetingStatus(m.meeting_date) === "UPCOMING"
  ).length;
  const completed = meetings.length - upcoming;

  const attendanceChart = attendance.map(a => ({
    name: a.name,
    count: a.present ? 1 : 0,
  }));

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>📅 Meetings</h2>

        {/* ===== DASHBOARD ===== */}
        <div style={dashGrid}>
          <div style={{ ...dashCard, background: "linear-gradient(135deg,#2563eb,#1e40af)" }}>
            <div style={{ fontSize: 32 }}>📅</div>
            <div>
              <small>Upcoming</small>
              <h2>{upcoming}</h2>
            </div>
          </div>

          <div style={{ ...dashCard, background: "linear-gradient(135deg,#16a34a,#166534)" }}>
            <div style={{ fontSize: 32 }}>✅</div>
            <div>
              <small>Completed</small>
              <h2>{completed}</h2>
            </div>
          </div>
        </div>

        {/* ===== CREATE / EDIT ===== */}
        {ADMIN_ROLES.includes(role) && (
          <div style={card}>
            <h3>{editing ? "✏️ Edit Meeting" : "➕ Create Meeting"}</h3>

            <input style={input} placeholder="Meeting Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input style={input} type="datetime-local"
              value={form.meeting_date}
              onChange={(e) => setForm({ ...form, meeting_date: e.target.value })}
            />

            <textarea style={textarea} placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input style={input} placeholder="Zoom / Google Meet Link"
              value={form.join_link}
              onChange={(e) => setForm({ ...form, join_link: e.target.value })}
            />

            <button style={btnPrimary} onClick={saveMeeting}>
              {editing ? "Update" : "Create"}
            </button>
          </div>
        )}

        {/* ===== MEETINGS LIST ===== */}
        <div style={grid}>
          {meetings.map((m) => (
            <div
              key={m.id}
              style={cardAnimated}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={cardHeader}>
                <b>{m.title}</b>
                <span style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontSize: 12,
                  color: "#fff",
                  background: MEETING_META[meetingStatus(m.meeting_date)].color
                }}>
                  {MEETING_META[meetingStatus(m.meeting_date)].icon} {meetingStatus(m.meeting_date)}
                </span>
              </div>

   <p>
  🕒 {new Date(m.meeting_date).toLocaleString()} <br/>
  📅 {smartDay(m.meeting_date)} <br/>
  ⏳ {meetingCountdown(m.meeting_date)}
  {isLive(m.meeting_date) && <span style={{ color: "red", fontWeight: 700 }}> 🔴 LIVE</span>}
</p>


              <button style={btnPrimary} onClick={() => openMeeting(m)}>Open</button>
              {ADMIN_ROLES.includes(role) && (
                <button style={btnSecondary} onClick={() => {
                  setSelected(m);
                  setEditing(true);
                  setForm({
                    title: m.title,
                meeting_date: m.meeting_date.replace(" ", "T").slice(0, 16),
                    description: m.description || "",
                    join_link: m.join_link || "",
                  });
                }}>Edit</button>
              )}
              {CAN_DELETE && (
                <button style={btnDanger} onClick={() => deleteMeeting(m.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>

        {/* ===== MEETING DETAILS ===== */}
        {selected && (
          <div style={card}>
            <h3>{selected.title}</h3>
            {/* ===== MEETING AGENDA ===== */}
<div style={box}>
  <h4>📝 Meeting Agenda</h4>

  {ADMIN_ROLES.includes(role) && !agendaLocked ? (
    <>
      <textarea
        value={agenda}
        onChange={(e) => setAgenda(e.target.value)}
        style={textarea}
        placeholder="Enter agenda points..."
      />
      <button style={btnPrimary} onClick={saveAgenda}>
  Save Agenda
</button>
    </>
  ) : (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {agenda || "No agenda set"}
    </pre>
      )}
      <p style={{
  marginTop: 10,
  fontWeight: 700,
  color: agendaLockCountdown(selected.meeting_date).includes("Locked")
    ? "#dc2626"
    : "#16a34a"
}}>
  {agendaLockCountdown(selected.meeting_date)}
</p>

{role === "PRESIDENT" && agendaLocked && (
  <button
    style={{ ...btnPrimary, background: "#dc2626" }}
    onClick={async () => {
      await api.post(`/meetings/agenda-unlock/${selected.id}`);
      const r = await api.get(`/meetings/agenda/${selected.id}`);
      setAgendaLocked(r.data.agenda_locked);
      alert("Agenda unlocked by President");
    }}
  >
    🔓 Override Lock
  </button>
)}
</div>

            {selected.join_link && (
              <a href={selected.join_link} target="_blank" rel="noreferrer" style={joinBtn}>
                🎥 Join Meeting
              </a>
            )}

            {/* ===== ATTENDANCE CHART ===== */}
            {attendance.length > 0 && (
              <div style={chartCard}>
                <h4>👥 Attendance</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={attendanceChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ===== MINUTES UPLOAD ===== */}
            {ADMIN_ROLES.includes(role) && (
              <div style={box}>
                <h4>📄 Upload Meeting Minutes</h4>
                <input type="file" accept="application/pdf"
                  onChange={(e) => setMinutesFile(e.target.files[0])}
                />
                <button style={btnPrimary} onClick={uploadMinutes}>Upload</button>
              </div>
            )}
            {ADMIN_ROLES.includes(role) && (
  <div style={box}>
    <h4>🧾 Auto Generate Minutes</h4>
    <button
      style={{ ...btnPrimary, background: "#16a34a" }}
      onClick={async () => {
        const r = await api.post(`/meetings/minutes-pdf/${selected.id}`);
        window.open(
          `${import.meta.env.VITE_API_BASE_URL}/${r.data.pdf}`,
          "_blank"
        );
      }}
    >
      📥 Generate Minutes PDF
    </button>
  </div>
)}

            {/* ===== RESOLUTIONS ===== */}
           {ADMIN_ROLES.includes(role) && (
  <div style={box}>
    <h4>➕ Create Resolution</h4>

    <input
      style={input}
      placeholder="Resolution Title"
      value={newTitle}
      onChange={e => setNewTitle(e.target.value)}
    />

    <textarea
      style={textarea}
      placeholder="Resolution Details"
      value={newContent}
      onChange={e => setNewContent(e.target.value)}
    />

    <input
      type="datetime-local"
      style={input}
      value={deadline}
      onChange={e => setDeadline(e.target.value)}
    />

    <button style={btnPrimary} onClick={addResolution}>
      Add Resolution
    </button>
  </div>
)}
            <h4>📜 Resolutions</h4>

            {resolutions.map((r) => (
              <div key={r.id} style={resolutionCard}>
                <h5>{r.title}</h5>
                <p>{r.content}</p>
                {r.vote_deadline && (
  <p>⏳ Voting ends in {meetingCountdown(r.vote_deadline)}</p>
)}

                <p>Status: <b style={{ color: r.status === "APPROVED" ? "green" : "orange" }}>
                  {r.status}
                </b></p>
   

              {((CAN_VOTE.includes(role)) || role==="PRESIDENT") &&
 !r.is_locked && (
                  <>
                    <button style={btnYes} onClick={() => vote(r.id, "YES")}>👍 YES</button>
                    <button style={btnNo} onClick={() => vote(r.id, "NO")}>👎 NO</button>
                  </>
                )}
                {votes[r.id] && (
  <div style={{ marginTop: 10, background: "#f1f5f9", padding: 10, borderRadius: 8 }}>
    <b>🧾 Who Voted</b>
    {votes[r.id].length > 0 ? (
      votes[r.id].map((v, i) => (
        <div key={i}>
          {v.vote === "YES" ? "👍" : "👎"} {v.name}
        </div>
      ))
    ) : (
      <div>No votes yet</div>
    )}
  </div>
)}

                {r.pdf_path && (
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL}/${r.pdf_path}`}
                    target="_blank"
                    rel="noreferrer"
                    style={pdfBtn}
                  >
                    📄 Download Resolution PDF
                  </a>
                )}
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

const dashGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 30 };

const dashCard = { color: "#fff", padding: 20, borderRadius: 18, display: "flex", gap: 16, alignItems: "center", boxShadow: "0 20px 40px rgba(0,0,0,.15)" };

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 };

const card = { background: "#fff", padding: 20, borderRadius: 18, marginBottom: 20, boxShadow: "0 10px 25px rgba(0,0,0,.08)" };

const cardAnimated = { ...card, transition: "transform .25s, box-shadow .25s" };

const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "center" };

const chartCard = { background: "#fff", padding: 20, borderRadius: 16, marginTop: 20, boxShadow: "0 10px 25px rgba(0,0,0,.08)" };

const resolutionCard = { border: "1px solid #e5e7eb", padding: 15, borderRadius: 12, marginBottom: 15 };

const box = { background: "#f8fafc", padding: 15, borderRadius: 12, marginBottom: 20 };

const input = { width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #cbd5f5" };

const textarea = { width: "100%", height: 80, padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #cbd5f5" };

const btnPrimary = { background: "#2563eb", color: "#fff", padding: "8px 14px", border: "none", borderRadius: 8, marginRight: 6 };

const btnSecondary = { background: "#f59e0b", color: "#fff", padding: "8px 14px", border: "none", borderRadius: 8, marginRight: 6 };

const btnDanger = { background: "#dc2626", color: "#fff", padding: "8px 14px", border: "none", borderRadius: 8 };

const btnYes = { background: "#16a34a", color: "#fff", padding: "6px 12px", marginRight: 8, borderRadius: 6 };

const btnNo = { background: "#dc2626", color: "#fff", padding: "6px 12px", borderRadius: 6 };

const joinBtn = { display: "inline-block", marginBottom: 15, background: "#0ea5e9", color: "#fff", padding: "8px 14px", borderRadius: 8, textDecoration: "none" };

const pdfBtn = { display: "inline-block", marginTop: 10, background: "#16a34a", color: "#fff", padding: "6px 12px", borderRadius: 6, textDecoration: "none" };
