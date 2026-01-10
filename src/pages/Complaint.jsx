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
  const [commentInput, setCommentInput] = useState({});
  const [loading, setLoading] = useState(true);

  const [assignDays, setAssignDays] = useState({});

  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "NORMAL",
  });

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    loadComplaints();
    if (ADMIN_ROLES.includes(ROLE)) {
      api.get("/complaints/stats").then(res => setStats(res.data));
    }
  }, []);

  const loadComplaints = async () => {
    try {
      let res;
      if (ROLE === "MEMBER") res = await api.get("/complaints/my");
      else if (OFFICE_ROLES.includes(ROLE))
        res = await api.get("/complaints/assigned");
      else res = await api.get("/complaints/all");

      setComplaints(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CREATE
  ========================= */
  const submitComplaint = async () => {
    if (!form.subject || !form.description)
      return alert("Subject & description required");

    await api.post("/complaints/create", form);
    setForm({ subject: "", description: "", priority: "NORMAL" });
    loadComplaints();
  };

  /* =========================
     ASSIGN (PRESIDENT)
  ========================= */
  const assignComplaint = async (id, role) => {
    const days = assignDays[id] || DEFAULT_SLA_DAYS;

    await api.put(`/complaints/assign/${id}`, {
      assigned_role: role,
      sla_days: days,
    });

    loadComplaints();
  };

  /* =========================
     COMMENTS
  ========================= */
  const loadComments = async (id) => {
    const res = await api.get(`/complaints/comments/${id}`);
    setComments(p => ({ ...p, [id]: res.data || [] }));
  };

  const addComment = async (id) => {
    if (!commentInput[id]) return;
    await api.post(`/complaints/comment/${id}`, {
      comment: commentInput[id],
    });
    setCommentInput(p => ({ ...p, [id]: "" }));
    loadComments(id);
  };

  /* =========================
     SLA CALC
  ========================= */
  const slaInfo = (created_at, slaDays = DEFAULT_SLA_DAYS) => {
    const created = new Date(created_at);
    const deadline = new Date(created);
    deadline.setDate(deadline.getDate() + slaDays);

    const diff = deadline - new Date();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return {
      overdue: diff < 0,
      text: diff < 0 ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days left`,
    };
  };

  /* =========================
     RENDER
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
                <small>{k.replace("_", " ").toUpperCase()}</small>
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
            Submit Complaint
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {/* LIST */}
        {complaints.map(c => {
          const sla = slaInfo(c.created_at, c.sla_days);
          return (
            <div key={c.id} style={card}>
              <div style={cardHeader}>
                <strong>{c.subject}</strong>
                <span style={{ ...badge, background: STATUS_COLORS[c.status] }}>
                  {c.status}
                </span>
              </div>

              <p>{c.description}</p>

              {/* SLA */}
              {c.status !== "CLOSED" && (
                <p style={{ color: sla.overdue ? "#dc2626" : "#16a34a" }}>
                  ⏳ SLA: {sla.text}
                </p>
              )}

              {/* ASSIGN */}
              {ADMIN_ROLES.includes(ROLE) && c.status === "OPEN" && (
                <div style={assignBox}>
                  <input
                    type="number"
                    placeholder="SLA Days"
                    value={assignDays[c.id] || ""}
                    onChange={e =>
                      setAssignDays({ ...assignDays, [c.id]: e.target.value })
                    }
                    style={slaInput}
                  />

                  <select
                    onChange={e => assignComplaint(c.id, e.target.value)}
                    style={input}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Assign to Office
                    </option>
                    {OFFICE_ROLES.map(r => (
                      <option key={r} value={r}>
                        {r.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* COMMENTS */}
              <button style={commentBtn} onClick={() => loadComments(c.id)}>
                💬 Comments
              </button>

              {comments[c.id]?.map((cm, i) => (
                <div key={i} style={commentItem}>
                  <b>{cm.commented_by}</b>
                  <p>{cm.comment}</p>
                </div>
              ))}

              {(OFFICE_ROLES.includes(ROLE) || ADMIN_ROLES.includes(ROLE)) && (
                <>
                  <textarea
                    style={commentInputStyle}
                    placeholder="Add comment..."
                    value={commentInput[c.id] || ""}
                    onChange={e =>
                      setCommentInput({
                        ...commentInput,
                        [c.id]: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => addComment(c.id)}>
                    Add Comment
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const dashRow = { display: "flex", gap: 16, marginBottom: 20 };
const dashCard = { background: "#fff", padding: 20, borderRadius: 16 };
const card = { background: "#fff", padding: 22, borderRadius: 18, marginBottom: 18 };
const cardHeader = { display: "flex", justifyContent: "space-between" };
const badge = { padding: "6px 14px", borderRadius: 999 };
const input = { width: "100%", padding: 10, marginTop: 6 };
const textarea = { width: "100%", height: 100, padding: 10 };
const btnPrimary = { background: "#2563eb", color: "#fff", padding: "10px 18px" };
const commentBtn = { marginTop: 10 };
const commentItem = { borderLeft: "3px solid #2563eb", paddingLeft: 10, marginTop: 8 };
const commentInputStyle = { width: "100%", height: 60 };
const assignBox = { display: "flex", gap: 8, marginTop: 8 };
const slaInput = { width: 100, padding: 8 };
