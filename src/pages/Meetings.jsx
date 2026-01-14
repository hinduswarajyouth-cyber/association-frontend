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

/* ================= HELPERS ================= */
const parseDate = (d) => new Date(d.includes("T") ? d : d.replace(" ", "T"));

const meetingCountdown = (d) => {
  const diff = parseDate(d).getTime() - Date.now();
  if (diff <= 0) return "Started";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
};

const isLive = (d) => {
  const t = parseDate(d).getTime();
  const now = Date.now();
  return now > t - 15 * 60 * 1000 && now < t + 2 * 60 * 60 * 1000;
};

const meetingStatus = (d) =>
  parseDate(d) > new Date() ? "UPCOMING" : "COMPLETED";

const smartDay = (d) => {
  const date = parseDate(d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diff = (date - today) / 86400000;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString("en-IN", { weekday: "long" });
};

const agendaLockCountdown = (d) => {
  const lockTime = parseDate(d).getTime() + 15 * 60 * 1000;
  const diff = lockTime - Date.now();
  if (diff <= 0) return "🔒 Agenda Locked";
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `🔓 Locks in ${m}m ${s}s`;
};

/* ================= COMPONENT ================= */
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
  const CAN_DELETE = role === "SUPER_ADMIN";

  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [votes, setVotes] = useState({});
  const [attendance, setAttendance] = useState([]);
  const quorum = Math.ceil(
    attendance.filter((a) => a.present).length / 2
  );

  const [agenda, setAgenda] = useState("");
  const [agendaLocked, setAgendaLocked] = useState(false);

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

    const voteMap = {};
    for (const res of r.data || []) {
      const vr = await api.get(`/meetings/votes/${res.id}`);
      voteMap[res.id] = vr.data;
    }
    setVotes(voteMap);

    api.get(`/meetings/attendance/${m.id}`)
      .then((res) => setAttendance(res.data || []))
      .catch(() => setAttendance([]));

    api.get(`/meetings/agenda/${m.id}`)
      .then((r) => {
        setAgenda(r.data.agenda || "");
        setAgendaLocked(r.data.agenda_locked);
      })
      .catch(() => {
        setAgenda("");
        setAgendaLocked(false);
      });
  };

  /* ================= SAVE MEETING ================= */
  const saveMeeting = async () => {
    if (!form.title || !form.meeting_date) {
      alert("Title & Date required");
      return;
    }

    const payload = {
      ...form,
      meeting_date: new Date(form.meeting_date).toISOString(),
    };

    if (editing) {
      await api.put(`/meetings/${selected.id}`, payload);
    } else {
      await api.post("/meetings/create", payload);
    }

    setForm({ title: "", meeting_date: "", description: "", join_link: "" });
    setSelected(null);
    setEditing(false);
    loadMeetings();
  };

  /* ================= VOTE ================= */
  const vote = async (rid, v) => {
    try {
      await api.post(`/meetings/vote/${rid}`, { vote: v });
      const vr = await api.get(`/meetings/votes/${rid}`);
      setVotes((p) => ({ ...p, [rid]: vr.data }));
      alert("✅ Vote submitted");
    } catch (err) {
      alert(err.response?.data?.error || "Vote failed");
    }
  };

  /* ================= JSX ================= */
  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>📅 Meetings</h2>

        <div style={{ display: "grid", gap: 16 }}>
          {meetings.map((m) => (
            <div key={m.id} style={{ padding: 16, border: "1px solid #ddd" }}>
              <b>{m.title}</b>
              <p>
                🕒 {new Date(m.meeting_date).toLocaleString()} <br />
                📅 {smartDay(m.meeting_date)} <br />
                ⏳ {meetingCountdown(m.meeting_date)}
                {isLive(m.meeting_date) && (
                  <span style={{ color: "red" }}> 🔴 LIVE</span>
                )}
              </p>

              <button onClick={() => openMeeting(m)}>Open</button>

              {ADMIN_ROLES.includes(role) && (
                <button
                  onClick={() => {
                    setSelected(m);
                    setEditing(true);
                    setForm({
                      title: m.title,
                      meeting_date: parseDate(m.meeting_date)
                        .toISOString()
                        .slice(0, 16),
                      description: m.description || "",
                      join_link: m.join_link || "",
                    });
                  }}
                >
                  Edit
                </button>
              )}

              {CAN_DELETE && (
                <button onClick={() => api.delete(`/meetings/${m.id}`)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
