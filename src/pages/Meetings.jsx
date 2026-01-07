import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   SAFE ROLE FROM JWT
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

const CREATE_ROLES = [
  "SUPER_ADMIN",
  "PRESIDENT",
  "GENERAL_SECRETARY",
];

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_date: "",
    location: "",
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  /* =========================
     LOAD MEETINGS
  ========================= */
  const loadMeetings = async () => {
    try {
      const res = await api.get("/api/meetings/my");
      setMeetings(res.data || []);
    } catch (err) {
      console.error("Load meetings error 👉", err);
      alert("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CREATE MEETING
  ========================= */
  const createMeeting = async () => {
    if (!form.title || !form.meeting_date) {
      alert("Title & Date required");
      return;
    }

    try {
      await api.post("/api/meetings/create", form);
      alert("Meeting created");
      setForm({
        title: "",
        description: "",
        meeting_date: "",
        location: "",
      });
      loadMeetings();
    } catch (err) {
      console.error("Create meeting error 👉", err);
      alert("Failed to create meeting");
    }
  };

  /* =========================
     ATTENDANCE
  ========================= */
  const markAttendance = async (id, status) => {
    try {
      await api.post(`/api/meetings/attendance/${id}`, { status });
      alert("Attendance saved");
    } catch (err) {
      console.error("Attendance error 👉", err);
      alert("Failed to save attendance");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 25 }}>
        <h2>📅 Meetings & Events</h2>

        {/* ================= CREATE ================= */}
        {CREATE_ROLES.includes(ROLE) && (
          <div style={{ marginBottom: 30 }}>
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
          </div>
        )}

        {/* ================= LIST ================= */}
        <h3>Meetings</h3>

        {loading && <p>Loading meetings...</p>}

        {!loading && meetings.length === 0 && (
          <p>No meetings found</p>
        )}

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
            <p>
              <b>Date:</b>{" "}
              {new Date(m.meeting_date).toLocaleString()}
            </p>
            <p>
              <b>Location:</b> {m.location || "-"}
            </p>

            {/* ================= MEMBER ATTENDANCE ================= */}
            {ROLE === "MEMBER" && (
              <div>
                <button onClick={() => markAttendance(m.id, "PRESENT")}>
                  Present
                </button>{" "}
                <button onClick={() => markAttendance(m.id, "ABSENT")}>
                  Absent
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
