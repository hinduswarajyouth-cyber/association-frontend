import React, { useEffect, useState } from "react";
import api from "../api/api";

/* =========================
   ROLE FROM JWT
========================= */
const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1])).role;
};

const ROLE = getRole();

const CREATE_ROLES = [
  "SUPER_ADMIN",
  "PRESIDENT",
  "GENERAL_SECRETARY",
];

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_date: "",
    location: "",
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const res = await api.get("/api/meetings/my");
    setMeetings(res.data);
  };

  /* =========================
     CREATE MEETING
  ========================= */
  const createMeeting = async () => {
    if (!form.title || !form.meeting_date) {
      alert("Title & Date required");
      return;
    }

    await api.post("/api/meetings/create", form);
    alert("Meeting created");
    setForm({ title: "", description: "", meeting_date: "", location: "" });
    loadMeetings();
  };

  /* =========================
     ATTENDANCE
  ========================= */
  const markAttendance = async (id, status) => {
    await api.post(`/api/meetings/attendance/${id}`, { status });
    alert("Attendance saved");
  };

  return (
    <div style={{ padding: 25 }}>
      <h2>📅 Meetings & Events</h2>

      {/* ================= CREATE ================= */}
      {CREATE_ROLES.includes(ROLE) && (
        <>
          <h3>Create Meeting</h3>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <br /><br />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <br /><br />

          <input
            type="datetime-local"
            value={form.meeting_date}
            onChange={(e) =>
              setForm({ ...form, meeting_date: e.target.value })
            }
          />
          <br /><br />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />
          <br /><br />

          <button onClick={createMeeting}>Create</button>
          <hr />
        </>
      )}

      {/* ================= LIST ================= */}
      <h3>Meetings</h3>

      {meetings.length === 0 && <p>No meetings found</p>}

      {meetings.map((m) => (
        <div
          key={m.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <h4>{m.title}</h4>
          <p>{m.description}</p>
          <p><b>Date:</b> {new Date(m.meeting_date).toLocaleString()}</p>
          <p><b>Location:</b> {m.location || "-"}</p>

          {/* ================= MEMBER ATTENDANCE ================= */}
          {ROLE === "MEMBER" && (
            <>
              <button onClick={() => markAttendance(m.id, "PRESENT")}>
                Present
              </button>{" "}
              <button onClick={() => markAttendance(m.id, "ABSENT")}>
                Absent
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
