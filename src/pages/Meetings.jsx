import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   🔐 SAFE ROLE FROM JWT
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
    } catch {
      alert("Failed to save attendance");
    }
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2 style={pageTitle}>📅 Meetings & Events</h2>

        {/* ================= CREATE ================= */}
        {CREATE_ROLES.includes(ROLE) && (
          <div style={card}>
            <h3>Create Meeting</h3>

            <div style={formGrid}>
              <input
                style={input}
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                type="datetime-local"
                style={input}
                value={form.meeting_date}
                onChange={(e) =>
                  setForm({ ...form, meeting_date: e.target.value })
                }
              />

              <input
                style={input}
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>

            <textarea
              style={textarea}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button style={btnPrimary} onClick={createMeeting}>
              Create Meeting
            </button>
          </div>
        )}

        {/* ================= LIST ================= */}
        <h3>Meetings</h3>

        {loading && <p>Loading meetings...</p>}
        {!loading && meetings.length === 0 && <p>No meetings found</p>}

        <div style={grid}>
          {meetings.map((m) => (
            <div key={m.id} style={card}>
              <h4>{m.title}</h4>
              <p style={muted}>{m.description}</p>

              <p>
                <b>Date:</b>{" "}
                {new Date(m.meeting_date).toLocaleString()}
              </p>
              <p>
                <b>Location:</b> {m.location || "-"}
              </p>

              {ROLE === "MEMBER" && (
                <div style={actionRow}>
                  <button
                    style={btnSuccess}
                    onClick={() =>
                      markAttendance(m.id, "PRESENT")
                    }
                  >
                    Present
                  </button>
                  <button
                    style={btnDanger}
                    onClick={() =>
                      markAttendance(m.id, "ABSENT")
                    }
                  >
                    Absent
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* =========================
   🎨 STYLES
========================= */
const page = {
  padding: 30,
  background: "#f1f5f9",
  minHeight: "100vh",
};

const pageTitle = {
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 16,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 12,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const textarea = {
  width: "100%",
  height: 90,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  marginBottom: 12,
};

const actionRow = {
  display: "flex",
  gap: 10,
  marginTop: 10,
};

const muted = { color: "#64748b" };

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnSuccess = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const btnDanger = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};
