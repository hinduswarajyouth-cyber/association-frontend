import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   ROLE HELPERS
========================= */
const USER = JSON.parse(localStorage.getItem("user")) || {};
const ROLE = USER.role;

const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
const OFFICE_ROLES = [
  "VICE_PRESIDENT",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
  "EC_MEMBER",
];

const STATUS_COLORS = {
  OPEN: "#fde68a",
  FORWARDED: "#bfdbfe",
  IN_PROGRESS: "#93c5fd",
  RESOLVED: "#86efac",
  CLOSED: "#e5e7eb",
};

const DEFAULT_SLA_DAYS = 7;

/* =========================
   COMPONENT
========================= */
export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [comments, setComments] = useState({});
  const [text, setText] = useState({});
  const [loading, setLoading] = useState(true);
  const [assignDays, setAssignDays] = useState({});

  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "NORMAL",
  });

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    loadComplaints();
    if (ADMIN_ROLES.includes(ROLE)) {
      api.get("/complaints/stats").then(r => setStats(r.data));
    }
  }, []);

  const loadComplaints = async () => {
    let res;
    if (ROLE === "MEMBER") res = await api.get("/complaints/my");
    else if (OFFICE_ROLES.includes(ROLE)) res = await api.get("/complaints/assigned");
    else res = await api.get("/complaints/all");

    setComplaints(res.data || []);
    setLoading(false);
  };

  /* =========================
     CREATE
  ========================= */
  const submitComplaint = async () => {
    if (!form.subject || !form.description) return alert("Required");
    await api.post("/complaints/create", form);
    setForm({ subject: "", description: "", priority: "NORMAL" });
    loadComplaints();
  };

  /* =========================
     ASSIGN (ADMIN)
  ========================= */
  const assignComplaint = async (id, role) => {
    await api.put(`/complaints/assign/${id}`, {
      assigned_role: role,
      instruction: text[id],
    });
    setText({});
    loadComplaints();
  };

  /* =========================
     ACCEPT / UPDATE (OFFICE)
  ========================= */
  const updateProgress = async (id, status) => {
    await api.put(`/complaints/progress/${id}`, {
      status,
      comment: text[id],
    });
    setText({});
    loadComplaints();
  };

  /* =========================
     OVERRIDE (ADMIN)
  ========================= */
  const overrideAssign = async (id, role) => {
    await api.put(`/complaints/override/${id}`, {
      assigned_role: role,
      reason: text[id],
    });
    setText({});
    loadComplaints();
  };

  /* =========================
     COMMENTS
  ========================= */
  const loadComments = async (id) => {
    const res = await api.get(`/complaints/comments/${id}`);
    setComments(p => ({ ...p, [id]: res.data }));
  };

  /* =========================
     SLA
  ========================= */
  const slaInfo = (created_at, days = DEFAULT_SLA_DAYS) => {
    const end = new Date(created_at);
    end.setDate(end.getDate() + days);
    const diff = end - new Date();
    const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diff < 0 ? `Overdue by ${Math.abs(d)} days` : `${d} days left`;
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>📮 Complaint Management</h2>

        {/* DASHBOARD */}
        {stats && (
          <div style={dashRow}>
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} style={dashCard}>
                <small>{k.toUpperCase()}</small>
                <h2>{v}</h2>
              </div>
            ))}
          </div>
        )}

        {/* CREATE */}
        <div style={card}>
          <h3>Create Complaint</h3>
          <input
            style={input}
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
  style={textarea}
  placeholder="Description"
  value={form.description}
  onChange={e => setForm({ ...form, description: e.target.value })}
/>
          <button style={btnPrimary} onClick={submitComplaint}>
            Submit
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {/* LIST */}
        {complaints.map(c => (
          <div key={c.id} style={card}>
            <div style={cardHeader}>
              <b>{c.subject}</b>
              <span style={{ ...badge, background: STATUS_COLORS[c.status] }}>
                {c.status}
              </span>
            </div>

            <p>{c.description}</p>
            <p>⏳ SLA: {slaInfo(c.created_at, c.sla_days)}</p>

            <p>
              Assigned To: <b>{c.assigned_role || "Not Assigned"}</b>
            </p>

            {/* ADMIN ASSIGN */}
            {ADMIN_ROLES.includes(ROLE) && c.status === "OPEN" && (
              <>
                <textarea
                  placeholder="Instruction"
                  style={textareaSmall}
                  value={text[c.id] || ""}
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <select onChange={e => assignComplaint(c.id, e.target.value)}>
                  <option>Select Office</option>
                  {OFFICE_ROLES.map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </>
            )}

            {/* OFFICE ACTION */}
            {OFFICE_ROLES.includes(ROLE) && (
              <>
                <textarea
                  placeholder="Work update / resolution"
                  style={textareaSmall}
                  value={text[c.id] || ""}
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button onClick={() => updateProgress(c.id, "IN_PROGRESS")}>
                  Accept / In Progress
                </button>
                <button onClick={() => updateProgress(c.id, "RESOLVED")}>
                  Mark Resolved
                </button>
              </>
            )}

            {/* ADMIN OVERRIDE */}
            {ADMIN_ROLES.includes(ROLE) && c.status !== "CLOSED" && (
              <>
                <textarea
                  placeholder="Override reason"
                  style={textareaSmall}
                  value={text[c.id] || ""}
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <select onChange={e => overrideAssign(c.id, e.target.value)}>
                  <option>Override Assign</option>
                  {OFFICE_ROLES.map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </>
            )}

            {/* COMMENTS */}
            <button onClick={() => loadComments(c.id)}>💬 View Timeline</button>
            {comments[c.id]?.map((cm, i) => (
              <div key={i} style={comment}>
                <b>{cm.commented_by}</b> ({cm.comment_type})
                <p>{cm.comment}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const dashRow = { display: "flex", gap: 16 };
const dashCard = { background: "#fff", padding: 16, borderRadius: 14 };
const card = { background: "#fff", padding: 20, borderRadius: 18, marginBottom: 16 };
const cardHeader = { display: "flex", justifyContent: "space-between" };
const badge = { padding: "4px 12px", borderRadius: 999 };
const input = { width: "100%", padding: 10, marginBottom: 8 };
const textarea = { width: "100%", height: 90, padding: 10 };
const textareaSmall = { width: "100%", height: 60, marginTop: 6 };
const btnPrimary = { background: "#2563eb", color: "#fff", padding: "8px 16px" };
const comment = { borderLeft: "3px solid #2563eb", paddingLeft: 10, marginTop: 8 };
