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
  LIVE: { color: "#dc2626", icon: "🔴" },
  COMPLETED: { color: "#16a34a", icon: "✅" },
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

  /* ================= TIME & STATUS HELPERS ================= */
  const formatMeetingTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const getDayLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const diff = d.setHours(0,0,0,0) - today.setHours(0,0,0,0);

    if (diff === 0) return "Today";
    if (diff === 86400000) return "Tomorrow";
    if (diff === -86400000) return "Yesterday";

    return d.toLocaleDateString("en-IN", { weekday: "long" });
  };

  const getCountdown = (date) => {
    const diff = new Date(date) - new Date();
    if (diff <= 0) return null;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return `${h}h ${m}m`;
  };

  const meetingStatusAdvanced = (date) => {
    const now = new Date();
    const start = new Date(date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "LIVE";
    return "COMPLETED";
  };

  /* ================= LOAD ================= */
  const loadMeetings = async () => {
    const res = await api.get("/meetings");
    setMeetings(res.data || []);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  /* ================= OPEN ================= */
  const openMeeting = async (m) => {
    setSelected(m);
    setEditing(false);

    await api.post(`/meetings/join/${m.id}`).catch(() => {});
    const r = await api.get(`/meetings/resolution/${m.id}`);
    setResolutions(r.data || []);

    api.get(`/meetings/attendance/${m.id}`)
      .then(res => setAttendance(res.data || []))
      .catch(() => setAttendance([]));
  };

  /* ================= CREATE / UPDATE ================= */
  const saveMeeting = async () => {
    if (!form.title || !form.meeting_date) return alert("Title & Date required");

    const payload = {
      ...form,
      meeting_date: new Date(form.meeting_date + ":00").toISOString()
    };

    if (editing) await api.put(`/meetings/${selected.id}`, payload);
    else await api.post("/meetings/create", payload);

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

  /* ================= DASHBOARD ================= */
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.meeting_date) - new Date(b.meeting_date)
  );

  const upcoming = sortedMeetings.filter(
    (m) => meetingStatusAdvanced(m.meeting_date) === "UPCOMING"
  ).length;

  const completed = sortedMeetings.length - upcoming;

  /* ================= UI ================= */
  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>📅 Meetings</h2>
        <p>Upcoming: {upcoming} | Completed: {completed}</p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
          {sortedMeetings.map((m) => (
            <div key={m.id} style={{ background:"#fff", padding:20, borderRadius:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <b>{m.title}</b>
                <span style={{ background:MEETING_META[meetingStatusAdvanced(m.meeting_date)].color, color:"#fff", padding:"4px 12px", borderRadius:999 }}>
                  {MEETING_META[meetingStatusAdvanced(m.meeting_date)].icon} {meetingStatusAdvanced(m.meeting_date)}
                </span>
              </div>

              <p>🕒 {formatMeetingTime(m.meeting_date)}</p>
              <small>{getDayLabel(m.meeting_date)} {getCountdown(m.meeting_date) && `• ${getCountdown(m.meeting_date)}`}</small>

              {meetingStatusAdvanced(m.meeting_date)==="UPCOMING" &&
               getCountdown(m.meeting_date) &&
               new Date(m.meeting_date)-new Date() < 30*60*1000 && (
                <div style={{ background:"#fef3c7", padding:8, borderRadius:8, marginTop:8 }}>
                  ⚠ Starts in {getCountdown(m.meeting_date)}
                </div>
              )}

              <button onClick={() => openMeeting(m)}>Open</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
