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
    } catch {
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CREATE COMPLAINT
  ========================= */
  const submitComplaint = async () => {
    if (!form.subject || !form.description)
      return alert("Subject & description required");

    await api.post("/complaints/create", form);
    setForm({ subject: "", description: "", priority: "NORMAL" });
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
     UTIL
  ========================= */
  const isEscalated = (created_at) => {
    const days =
      (Date.now() - new Date(created_at)) / (1000 * 60 * 60 * 24);
    return days > 7;
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

        {/* LIST */}
        {loading && <p>Loading...</p>}

        {complaints.map(c => (
          <div key={c.id} style={card}>
            <div style={cardHeader}>
              <div>
                <strong>{c.subject}</strong>
                <div style={meta}>
                  Created by: <b>{c.member_name || "You"}</b>
                </div>
              </div>

              <span style={{ ...badge, background: STATUS_COLORS[c.status] }}>
                {c.status}
              </span>
            </div>

            <p>{c.description}</p>

            {isEscalated(c.created_at) && c.status !== "CLOSED" && (
              <p style={escalated}>⚠️ Auto Escalated (7+ days)</p>
            )}

            {/* COMMENTS */}
            <button style={commentBtn} onClick={() => loadComments(c.id)}>
              💬 View Comments
            </button>

            {comments[c.id]?.map((cm, i) => (
              <div key={i} style={commentItem}>
                <div style={commentHeader}>
                  <b>{cm.commented_by}</b>
                  <small>{new Date(cm.created_at).toLocaleString()}</small>
                </div>
                <p>{cm.comment}</p>
              </div>
            ))}

            {OFFICE_ROLES.includes(ROLE) && c.status !== "CLOSED" && (
              <>
                <textarea
                  style={commentInputStyle}
                  placeholder="Add update / resolution note"
                  value={commentInput[c.id] || ""}
                  onChange={e =>
                    setCommentInput({
                      ...commentInput,
                      [c.id]: e.target.value,
                    })
                  }
                />
                <button style={btnSecondary} onClick={() => addComment(c.id)}>
                  Add Comment
                </button>
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
                📄 Download Complaint Report
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
const dashRow = { display: "flex", gap: 16, marginBottom: 24 };
const dashCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  minWidth: 120,
  boxShadow: "0 8px 28px rgba(0,0,0,.1)",
};
const card = {
  background: "#fff",
  padding: 22,
  borderRadius: 18,
  marginBottom: 18,
  boxShadow: "0 12px 34px rgba(0,0,0,.08)",
};
const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};
const meta = { fontSize: 12, color: "#64748b" };
const badge = {
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: "bold",
};
const input = { width: "100%", padding: 12, marginBottom: 10 };
const textarea = { width: "100%", height: 100, padding: 12 };
const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: 10,
};
const btnSecondary = {
  background: "#0f172a",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 8,
  marginTop: 6,
};
const commentBtn = { marginTop: 10 };
const commentItem = {
  borderLeft: "3px solid #2563eb",
  paddingLeft: 12,
  marginTop: 10,
};
const commentHeader = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 12,
};
const commentInputStyle = { width: "100%", height: 70, marginTop: 8 };
const pdfBtn = {
  display: "inline-block",
  marginTop: 12,
  fontWeight: "bold",
  color: "#2563eb",
};
const escalated = { color: "#dc2626", fontWeight: "bold" };
