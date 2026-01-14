import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

/* ================= ROLES ================= */
const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
const EC_ROLES = [
  "EC_MEMBER",
  "PRESIDENT",
  "VICE_PRESIDENT",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
];

/* ================= HELPERS ================= */
const meetingTime = d => new Date(d);
const agendaLockTime = d =>
  meetingTime(d).getTime() + 15 * 60 * 1000;

const canEditAgenda = (meeting, role, agendaLocked) => {
  if (!ADMIN_ROLES.includes(role)) return false;
  if (role === "PRESIDENT") return true;
  return (
    !agendaLocked &&
    Date.now() < agendaLockTime(meeting.meeting_date)
  );
};

const canVote = (role, r) =>
  EC_ROLES.includes(role) &&
  !r.is_locked &&
  new Date() < new Date(r.vote_deadline);

/* ================= COMPONENT ================= */
export default function Meetings() {
  const { user } = useAuth();
  const role = user.role;

  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);

  const [agenda, setAgenda] = useState("");
  const [agendaLocked, setAgendaLocked] = useState(false);

  const [attendance, setAttendance] = useState([]);
  const [resolutions, setResolutions] = useState([]);
  const [votes, setVotes] = useState({});

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [deadline, setDeadline] = useState("");

  /* ================= LOAD MEETINGS ================= */
  const loadMeetings = async () => {
    const r = await api.get("/meetings");
    setMeetings(r.data || []);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  /* ================= OPEN MEETING (FIXED) ================= */
  const openMeeting = async (m) => {
    setSelected(m);

    // 🔑 allow React to re-render first
    await new Promise(r => setTimeout(r, 0));

    // attendance
    api.post(`/meetings/join/${m.id}`).catch(() => {});

    // agenda
    const a = await api.get(`/meetings/agenda/${m.id}`);
    setAgenda(a.data.agenda || "");
    setAgendaLocked(a.data.agenda_locked);

    // attendance list
    const at = await api.get(`/meetings/attendance/${m.id}`);
    setAttendance(at.data || []);

    // resolutions
    const r = await api.get(`/meetings/resolution/${m.id}`);
    setResolutions(r.data || []);

    // votes
    const voteMap = {};
    for (const res of r.data || []) {
      const vr = await api.get(`/meetings/votes/${res.id}`);
      voteMap[res.id] = vr.data;
    }
    setVotes(voteMap);
  };

  /* ================= AGENDA ================= */
  const saveAgenda = async () => {
    await api.post(`/meetings/agenda/${selected.id}`, { agenda });
    const r = await api.get(`/meetings/agenda/${selected.id}`);
    setAgenda(r.data.agenda || "");
    setAgendaLocked(r.data.agenda_locked);
    alert("Agenda saved");
  };

  /* ================= RESOLUTION ================= */
  const addResolution = async () => {
    if (!newTitle || !newContent)
      return alert("All fields required");

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

  /* ================= VOTING ================= */
  const hasVoted = (rid) =>
    votes[rid]?.some(v => v.user_id === user.id);

  const vote = async (rid, v) => {
    try {
      await api.post(`/meetings/vote/${rid}`, { vote: v });
      alert("Vote submitted");

      const r = await api.get(`/meetings/resolution/${selected.id}`);
      setResolutions(r.data || []);

      const vr = await api.get(`/meetings/votes/${rid}`);
      setVotes(prev => ({ ...prev, [rid]: vr.data }));
    } catch (e) {
      alert(e.response?.data?.error || "Vote failed");
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />
      <h2>📅 Meetings</h2>

      {/* ===== LIST ===== */}
      {meetings.map(m => (
        <div key={m.id}>
          <b>{m.title}</b>
          <button onClick={() => openMeeting(m)}>Open</button>
        </div>
      ))}

      {/* ===== DETAILS ===== */}
      {selected && (
        <>
          <hr />
          <h3>{selected.title}</h3>

          {/* ===== AGENDA ===== */}
          <h4>📝 Agenda</h4>
          {canEditAgenda(selected, role, agendaLocked) ? (
            <>
              <textarea
                value={agenda}
                onChange={e => setAgenda(e.target.value)}
              />
              <button onClick={saveAgenda}>Save</button>
            </>
          ) : (
            <pre>{agenda || "No agenda"}</pre>
          )}

          {role === "PRESIDENT" && agendaLocked && (
            <button
              onClick={async () => {
                await api.post(
                  `/meetings/agenda-unlock/${selected.id}`
                );
                const r = await api.get(
                  `/meetings/agenda/${selected.id}`
                );
                setAgendaLocked(r.data.agenda_locked);
              }}
            >
              🔓 Override Lock
            </button>
          )}

          {/* ===== CREATE RESOLUTION ===== */}
          {ADMIN_ROLES.includes(role) && (
            <>
              <h4>➕ Create Resolution</h4>
              <input
                placeholder="Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
              />
              <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
              <button onClick={addResolution}>Add</button>
            </>
          )}

          {/* ===== RESOLUTIONS ===== */}
          <h4>📜 Resolutions</h4>
          {resolutions.map(r => (
            <div key={r.id} style={{ border: "1px solid #ccc", padding: 10 }}>
              <b>{r.title}</b>
              <p>{r.content}</p>
              <p>Status: <b>{r.status}</b></p>

              {canVote(role, r) && !hasVoted(r.id) && (
                <>
                  <button onClick={() => vote(r.id, "YES")}>YES</button>
                  <button onClick={() => vote(r.id, "NO")}>NO</button>
                </>
              )}

              {votes[r.id]?.map((v, i) => (
                <div key={i}>
                  {v.vote} – {v.name}
                </div>
              ))}

              {r.pdf_path && (
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL}/${r.pdf_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 Resolution PDF
                </a>
              )}
            </div>
          ))}

          {/* ===== MINUTES PDF ===== */}
          {ADMIN_ROLES.includes(role) && (
            <button
              onClick={async () => {
                const r = await api.post(
                  `/meetings/minutes-pdf/${selected.id}`
                );
                window.open(
                  `${import.meta.env.VITE_API_BASE_URL}/${r.data.pdf}`,
                  "_blank"
                );
              }}
            >
              📥 Generate Minutes PDF
            </button>
          )}
        </>
      )}
    </>
  );
}
