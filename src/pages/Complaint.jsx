import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   ROLE HELPERS
========================= */
const ROLE = JSON.parse(localStorage.getItem("user"))?.role;

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

/* =========================
   COMPONENT
========================= */
export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [loading, setLoading] = useState(true);

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
      api.get("/complaints/stats").then(res => setStats(res.data));
    }
  }, []);

  const loadComplaints = async () => {
    let res;
    if (ROLE === "MEMBER") res = await api.get("/complaints/my");
    else if (OFFICE_ROLES.includes(ROLE))
      res = await api.get("/complaints/assigned");
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
     COMMENTS
  ========================= */
  const loadComments = async (id) => {
    const res = await api.get(`/complaints/comment/${id}`);
    setComments(p => ({ ...p, [id]: res.data }));
  };

  const addComment = async (id) => {
    await api.post(`/complaints/comment/${id}`, {
      comment: commentInput[id],
    });
    setCommentInput(p => ({ ...p, [id]: "" }));
    loadComments(id);
  };

  /* =========================
     UTIL
  ========================= */
  const isEscalated = (created_at) => {
    const days =
      (Date.now() - new Date(created_at)) / (1000 * 60 * 60 * 24);
    return days > 7;
  };

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
                <small>{k.replace("_", " ")}</small>
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

        {/* LIST */}
        {loading && <p>Loading...</p>}
        {complaints.map(c => (
          <div key={c.id} style={card}>
            <div style={cardHeader}>
              <strong>{c.subject}</strong>
              <span style={{ ...badge, background: STATUS_COLORS[c.status] }}>
                {c.status}
              </span>
            </div>

            <p>{c.description}</p>

            {isEscalated(c.created_at) && c.status !== "CLOSED" && (
              <p style={{ color: "#dc2626" }}>⚠️ Auto-Escalated</p>
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

            {OFFICE_ROLES.includes(ROLE) && (
              <>
                <textarea
                  style={commentInputStyle}
                  value={commentInput[c.id] || ""}
                  onChange={e =>
                    setCommentInput({ ...commentInput, [c.id]: e.target.value })
                  }
                />
                <button onClick={() => addComment(c.id)}>Add Comment</button>
              </>
            )}

            {/* PDF */}
            {ADMIN_ROLES.includes(ROLE) && (
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/complaints/pdf/${c.id}`}
                target="_blank"
                rel="noreferrer"
                style={pdfBtn}
              >
                📄 Download Report
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================
   🎨 PREMIUM STYLES
========================= */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const dashRow = { display: "flex", gap: 16, marginBottom: 20 };
const dashCard = {
  background: "#fff",
  padding: 18,
  borderRadius: 14,
  minWidth: 120,
  boxShadow: "0 8px 24px rgba(0,0,0,.1)",
  animation: "fadeUp .4s ease",
};
const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  marginBottom: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
};
const cardHeader = { display: "flex", justifyContent: "space-between" };
const badge = { padding: "4px 10px", borderRadius: 20, fontSize: 12 };
const input = { width: "100%", padding: 10, marginBottom: 8 };
const textarea = { width: "100%", height: 90, padding: 10 };
const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 8,
};
const commentBtn = { marginTop: 8 };
const commentItem = {
  borderTop: "1px solid #e5e7eb",
  marginTop: 6,
  paddingTop: 6,
};
const commentInputStyle = { width: "100%", height: 60 };
const pdfBtn = {
  display: "inline-block",
  marginTop: 10,
  color: "#2563eb",
  fontWeight: "bold",
};
