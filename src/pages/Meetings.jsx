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

/* ================= STATUS META ================= */
const MEETING_META = {
  UPCOMING: { color: "#2563eb", icon: "📅" },
  COMPLETED: { color: "#16a34a", icon: "✅" },
};

const ist = d => new Date(d);

/* ================= HELPERS ================= */
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

  const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
  const CAN_VOTE = [
    "EC_MEMBER",
    "VICE_PRESIDENT",
    "GENERAL_SECRETARY",
    "JOINT_SECRETARY",
  ];

  /* ================= STATES ================= */
  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [votes, setVotes] = useState({});
  const [attendance, setAttendance] = useState([]);
  const quorum = Math.ceil(attendance.length / 2);

  const [form, setForm] = useState({
    title: "",
    meeting_date: "",
    description: "",
    join_link: "",
  });

  const [agenda, setAgenda] = useState("");
  const [agendaLocked, setAgendaLocked] = useState(false);
  const [minutesFile, setMinutesFile] = useState(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    api.get("/meetings").then(res => setMeetings(res.data || []));
  }, []);

  /* ================= OPEN MEETING ================= */
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

    api.get(`/meetings/attendance/${m.id}`)
      .then(res => setAttendance(res.data || []))
      .catch(() => setAttendance([]));

    api.get(`/meetings/agenda/${m.id}`)
      .then(r => {
        setAgenda(r.data.agenda || "");
        setAgendaLocked(r.data.agenda_locked);
      });
  };

  /* ================= VOTE ================= */
  const vote = async (rid, v) => {
    await api.post(`/meetings/vote/${rid}`, { vote: v });
    const vr = await api.get(`/meetings/votes/${rid}`);
    setVotes(prev => ({ ...prev, [rid]: vr.data }));
  };

  /* ================= RENDER ================= */
  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>📅 Meetings</h2>

        {/* ===== MEETINGS LIST ===== */}
        <div style={grid}>
          {meetings.map(m => (
            <div key={m.id} style={card}>
              <b>{m.title}</b>

              <p>
                🕒 {new Date(m.meeting_date).toLocaleString()} <br />
                📅 {smartDay(m.meeting_date)} <br />
                ⏳ {meetingCountdown(m.meeting_date)}
                {isLive(m.meeting_date) && <span style={{ color: "red" }}> 🔴 LIVE</span>}
              </p>

              <button style={btnPrimary} onClick={() => openMeeting(m)}>
                Open
              </button>
            </div>
          ))}
        </div>

        {/* ===== MEETING DETAILS ===== */}
        {selected && (
          <div style={card}>
            <h3>{selected.title}</h3>

            <h4>📜 Resolutions</h4>
            {resolutions.map(r => (
              <div key={r.id} style={resolutionCard}>
                <h5>{r.title}</h5>
                <p>{r.content}</p>

                {((CAN_VOTE.includes(role)) || role === "PRESIDENT") &&
                  !votes[r.id]?.some(v => v.name === user.name) && (
                    <>
                      <button onClick={() => vote(r.id, "YES")}>👍 YES</button>
                      <button onClick={() => vote(r.id, "NO")}>👎 NO</button>
                    </>
                  )}

                {votes[r.id] && (
                  <div>
                    <b>Who Voted</b>
                    {votes[r.id].map((v, i) => (
                      <div key={i}>
                        {v.vote === "YES" ? "👍" : "👎"} {v.name}
                      </div>
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
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 };
const card = { background: "#fff", padding: 20, borderRadius: 16 };
const resolutionCard = { border: "1px solid #e5e7eb", padding: 12, marginBottom: 10 };
const btnPrimary = { background: "#2563eb", color: "#fff", padding: "6px 12px", border: "none", borderRadius: 6 };
