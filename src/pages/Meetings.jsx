import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

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

  const [form, setForm] = useState({
    title: "",
    meeting_date: "",
    description: "",
    join_link: "",
  });

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [deadline, setDeadline] = useState("");

  /* LOAD MEETINGS */
  const loadMeetings = async () => {
    const res = await api.get("/meetings");
    setMeetings(res.data || []);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  /* OPEN MEETING */
  const openMeeting = async (m) => {
    setSelected(m);
    setEditing(false);

    await api.post(`/meetings/join/${m.id}`).catch(() => {});
    const r = await api.get(`/meetings/resolution/${m.id}`);
    setResolutions(r.data || []);
  };

  /* CREATE / UPDATE */
  const saveMeeting = async () => {
    if (!form.title || !form.meeting_date) {
      alert("Title & Date required");
      return;
    }

    if (editing) {
      await api.put(`/meetings/${selected.id}`, form);
      alert("Meeting updated");
    } else {
      await api.post("/meetings/create", form);
      alert("Meeting created");
    }

    resetForm();
    loadMeetings();
  };

  const resetForm = () => {
    setForm({ title: "", meeting_date: "", description: "", join_link: "" });
    setSelected(null);
    setEditing(false);
  };

  /* DELETE */
  const deleteMeeting = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    await api.delete(`/meetings/${id}`);
    alert("Meeting deleted");
    loadMeetings();
  };

  /* VOTE */
  const vote = async (rid, v) => {
    await api.post(`/meetings/vote/${rid}`, { vote: v });
    const r = await api.get(`/meetings/resolution/${selected.id}`);
    setResolutions(r.data || []);
  };

  /* ADD RESOLUTION */
  const addResolution = async () => {
    if (!newTitle || !newContent) {
      alert("Resolution title & content required");
      return;
    }

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

        {/* CREATE / EDIT */}
        {ADMIN_ROLES.includes(role) && (
          <div style={card}>
            <h3>{editing ? "✏️ Edit Meeting" : "➕ Create Meeting"}</h3>

            <input
              style={input}
              placeholder="Meeting Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              style={input}
              type="datetime-local"
              value={form.meeting_date}
              onChange={(e) =>
                setForm({ ...form, meeting_date: e.target.value })
              }
            />

            <textarea
              style={textarea}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Zoom / Google Meet Link"
              value={form.join_link}
              onChange={(e) =>
                setForm({ ...form, join_link: e.target.value })
              }
            />

            <button style={btnPrimary} onClick={saveMeeting}>
              {editing ? "Update" : "Create"}
            </button>
          </div>
        )}

        {/* MEETING LIST */}
        <div style={grid}>
          {meetings.map((m) => (
            <div key={m.id} style={card}>
              <h4>{m.title}</h4>
              <p>{new Date(m.meeting_date).toLocaleString()}</p>

              <button style={btnDark} onClick={() => openMeeting(m)}>
                Open
              </button>

              {ADMIN_ROLES.includes(role) && (
                <button
                  style={btnSecondary}
                  onClick={() => {
                    setSelected(m);
                    setEditing(true);
                    setForm({
                      title: m.title,
                      meeting_date: m.meeting_date
                        ? m.meeting_date.slice(0, 16)
                        : "",
                      description: m.description || "",
                      join_link: m.join_link || "",
                    });
                  }}
                >
                  Edit
                </button>
              )}

              {CAN_DELETE && (
                <button
                  style={btnDanger}
                  onClick={() => deleteMeeting(m.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {/* MEETING DETAILS */}
        {selected && (
          <div style={card}>
            <h3>{selected.title}</h3>

            {selected.join_link && (
              <a
                href={selected.join_link}
                target="_blank"
                rel="noreferrer"
                style={joinBtn}
              >
                🎥 Join Meeting
              </a>
            )}

            {/* ADD RESOLUTION */}
            {ADMIN_ROLES.includes(role) && (
              <div style={box}>
                <h4>➕ Add Resolution</h4>

                <input
                  style={input}
                  placeholder="Resolution Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />

                <textarea
                  style={textarea}
                  placeholder="Resolution Content"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />

                <input
                  style={input}
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />

                <button style={btnPrimary} onClick={addResolution}>
                  Save Resolution
                </button>
              </div>
            )}

            {/* RESOLUTIONS */}
            <h4>📜 Resolutions</h4>

            {resolutions.map((r) => (
              <div key={r.id} style={resolutionCard}>
                <h5>{r.title}</h5>
                <p>{r.content}</p>

                <p>
                  Status:{" "}
                  <b
                    style={{
                      color:
                        r.status === "APPROVED"
                          ? "green"
                          : r.status === "REJECTED"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {r.status}
                  </b>
                </p>

                {r.is_locked && <p>🔒 Voting Closed</p>}

                {CAN_VOTE.includes(role) && !r.is_locked && (
                  <>
                    <button
                      style={btnYes}
                      onClick={() => vote(r.id, "YES")}
                    >
                      👍 YES
                    </button>
                    <button
                      style={btnNo}
                      onClick={() => vote(r.id, "NO")}
                    >
                      👎 NO
                    </button>
                  </>
                )}

                {r.status === "APPROVED" && r.pdf_path && (
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
