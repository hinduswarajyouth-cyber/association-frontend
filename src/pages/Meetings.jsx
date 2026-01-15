import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ================= META ================= */
const MEETING_META = {
  UPCOMING: { color: "#2563eb", icon: "📅" },
  COMPLETED: { color: "#16a34a", icon: "✅" },
};

const EC_ROLES = [
  "EC_MEMBER",
  "PRESIDENT",
  "VICE_PRESIDENT",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
];

const meetingCountdown = (d) => {
  const diff = new Date(d) - new Date();
  if (diff <= 0) return "Closed";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
};

const isLive = (d) => {
  const t = new Date(d).getTime();
  const now = Date.now();
  return now > t - 15 * 60 * 1000 && now < t + 2 * 60 * 60 * 1000;
};

export default function Meetings() {
  const { user } = useAuth();
  const role = user.role;

  const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
  const CAN_VOTE = [...EC_ROLES];
  const CAN_DELETE = role === "SUPER_ADMIN";

  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [votes, setVotes] = useState({});
  const [attendance, setAttendance] = useState([]);

  const quorum = Math.ceil(
    attendance.filter(a => EC_ROLES.includes(a.role)).length / 2
  );

  const [agenda, setAgenda] = useState("");
  const [agendaLocked, setAgendaLocked] = useState(false);
  const [now, setNow] = useState(Date.now());

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    api.get("/meetings").then(r => setMeetings(r.data || []));
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const openMeeting = async (m) => {
    setSelected(m);
    await api.post(`/meetings/join/${m.id}`).catch(() => {});
    const [resR, voteR, attR, agR] = await Promise.all([
      api.get(`/meetings/resolution/${m.id}`),
      api.get(`/meetings/attendance/${m.id}`),
      api.get(`/meetings/agenda/${m.id}`)
    ]);

    setResolutions(resR.data || []);
    setAttendance(attR.data || []);
    setAgenda(agR.data.agenda || "");
    setAgendaLocked(agR.data.agenda_locked);

    const vm = {};
    for (const r of resR.data || []) {
      const vr = await api.get(`/meetings/votes/${r.id}`);
      vm[r.id] = vr.data;
    }
    setVotes(vm);
  };
  const agendaLockCountdown = (d) => {
    const lockTime = new Date(d).getTime() + 15 * 60 * 1000;
    const diff = lockTime - now;
    if (diff <= 0) return "🔒 Agenda Locked";
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `🔓 Locks in ${m}m ${s}s`;
  };

  const vote = async (rid, v) => {
    try {
      await api.post(`/meetings/vote/${rid}`, { vote: v });
      alert("Vote submitted");
      const vr = await api.get(`/meetings/votes/${rid}`);
      setVotes(prev => ({ ...prev, [rid]: vr.data }));
    } catch (e) {
      alert(e.response?.data?.error || "Vote failed");
    }
  };

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

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>📅 Meetings</h2>

        {/* ===== MEETING LIST ===== */}
        <div style={grid}>
          {meetings.map(m => (
            <div key={m.id} style={cardAnimated}>
              <b>{m.title}</b>
              <p>
                {new Date(m.meeting_date).toLocaleString()}
                {isLive(m.meeting_date) && <b style={{ color: "red" }}> 🔴 LIVE</b>}
              </p>
              <button style={btnPrimary} onClick={() => openMeeting(m)}>Open</button>
            </div>
          ))}
        </div>

        {/* ===== MEETING DETAILS ===== */}
        {selected && (
          <div style={card}>
            <h3>{selected.title}</h3>

            {/* ===== AGENDA ===== */}
            <div style={box}>
              <h4>📝 Agenda</h4>
              {ADMIN_ROLES.includes(role) && (!agendaLocked || role === "PRESIDENT") ? (
                <>
                  <textarea
                    style={textarea}
                    value={agenda}
                    onChange={e => setAgenda(e.target.value)}
                  />
                  <button
                    style={btnPrimary}
                    onClick={async () => {
                      await api.post(`/meetings/agenda/${selected.id}`, { agenda });
                      alert("Agenda saved");
                    }}
                  >
                    Save Agenda
                  </button>
                </>
              ) : (
                <pre>{agenda}</pre>
              )}
              <p>{agendaLockCountdown(selected.meeting_date)}</p>
            </div>

            {/* ===== CREATE RESOLUTION ===== */}
            {ADMIN_ROLES.includes(role) && (
              <div style={box}>
                <h4>➕ Create Resolution</h4>
                <input
                  style={input}
                  placeholder="Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
                <textarea
                  style={textarea}
                  placeholder="Content"
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                />
                <button style={btnPrimary} onClick={addResolution}>
                  Add
                </button>
              </div>
            )}

            {/* ===== RESOLUTIONS ===== */}
            <h4>📜 Resolutions</h4>
            {resolutions.map(r => (
              <div key={r.id} style={resolutionCard}>
                <h5>{r.title}</h5>
                <p>{r.content}</p>
                <p>Status: <b>{r.status}</b></p>

                {!r.is_locked &&
                  CAN_VOTE.includes(role) &&
                  !votes[r.id]?.some(v => v.user_id === user.id) && (
                    <>
                      <button style={btnYes} onClick={() => vote(r.id, "YES")}>YES</button>
                      <button style={btnNo} onClick={() => vote(r.id, "NO")}>NO</button>
                    </>
                  )}

                {votes[r.id] && (
                  <div>
                    <b>Votes:</b>
                    {votes[r.id].map((v, i) => (
                      <div key={i}>{v.vote} - {v.name}</div>
                    ))}
                  </div>
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

const dashGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
  marginBottom: 30,
};

const dashCard = {
  color: "#fff",
  padding: 20,
  borderRadius: 18,
  display: "flex",
  gap: 16,
  alignItems: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,.15)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 16,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 18,
  marginBottom: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
};

const cardAnimated = {
  ...card,
  transition: "transform .25s, box-shadow .25s",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const chartCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  marginTop: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
};

const resolutionCard = {
  border: "1px solid #e5e7eb",
  padding: 15,
  borderRadius: 12,
  marginBottom: 15,
};

const box = {
  background: "#f8fafc",
  padding: 15,
  borderRadius: 12,
  marginBottom: 20,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const textarea = {
  width: "100%",
  height: 80,
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
  marginRight: 6,
};

const btnSecondary = {
  background: "#f59e0b",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
  marginRight: 6,
};

const btnDanger = {
  background: "#dc2626",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
};

const btnYes = {
  background: "#16a34a",
  color: "#fff",
  padding: "6px 12px",
  marginRight: 8,
  borderRadius: 6,
};

const btnNo = {
  background: "#dc2626",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
};

const joinBtn = {
  display: "inline-block",
  marginBottom: 15,
  background: "#0ea5e9",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: 8,
  textDecoration: "none",
};

const pdfBtn = {
  display: "inline-block",
  marginTop: 10,
  background: "#16a34a",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  textDecoration: "none",
};
