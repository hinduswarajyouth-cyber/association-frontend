import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   🔐 GET ROLE FROM JWT
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

const OFFICE_ROLES = [
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

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  /* COMMENTS STATE */
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

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

    if (["SUPER_ADMIN", "PRESIDENT"].includes(ROLE)) {
      api.get("/api/complaints/stats").then((res) => {
        setDashboard(res.data);
      });
    }
  }, []);

  const loadComplaints = async () => {
    try {
      let res;
      if (ROLE === "MEMBER") {
        res = await api.get("/api/complaints/my");
      } else if (OFFICE_ROLES.includes(ROLE)) {
        res = await api.get("/api/complaints/assigned");
      } else {
        res = await api.get("/api/complaints/all");
      }
      setComplaints(res.data || []);
    } catch (err) {
      console.error("LOAD COMPLAINTS ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MEMBER CREATE
  ========================= */
  const submitComplaint = async () => {
    if (!form.subject || !form.description) {
      alert("Fill all fields");
      return;
    }

    await api.post("/api/complaints/create", form);
    setForm({ subject: "", description: "", priority: "NORMAL" });
    loadComplaints();
  };

  /* =========================
     ASSIGN
  ========================= */
  const assignComplaint = async (id, role) => {
    if (!role) return alert("Select role");
    await api.put(`/api/complaints/assign/${id}`, { assigned_role: role });
    loadComplaints();
  };

  /* =========================
     UPDATE STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    if (!status) return;
    await api.put(`/api/complaints/update/${id}`, { status });
    loadComplaints();
  };

  /* =========================
     COMMENTS
  ========================= */
  const loadComments = async (id) => {
    const res = await api.get(`/api/complaints/${id}/comments`);
    setComments((prev) => ({ ...prev, [id]: res.data || [] }));
  };

  const addComment = async (id) => {
    if (!commentInput[id]) return alert("Comment required");

    await api.post(`/api/complaints/${id}/comment`, {
      comment: commentInput[id],
    });

    setCommentInput((prev) => ({ ...prev, [id]: "" }));
    loadComments(id);
  };

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>📮 Complaint Management</h2>

        {/* ================= DASHBOARD ================= */}
        {dashboard && (
          <div style={dashboardRow}>
            {Object.entries(dashboard).map(([k, v]) => (
              <div key={k} style={dashboardCard}>
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  {k.replaceAll("_", " ")}
                </div>
                <strong style={{ fontSize: 22 }}>{v}</strong>
              </div>
            ))}
          </div>
        )}

        {/* ================= CREATE ================= */}
        {ROLE === "MEMBER" && (
          <div style={card}>
            <h3>Create Complaint</h3>

            <input
              style={input}
              placeholder="Subject"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
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

            <select
              style={input}
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option>NORMAL</option>
              <option>HIGH</option>
            </select>

            <button style={btnPrimary} onClick={submitComplaint}>
              Submit Complaint
            </button>
          </div>
        )}

        {/* ================= LIST ================= */}
        <h3>Complaints</h3>

        {loading && <p>Loading complaints...</p>}
        {!loading && complaints.length === 0 && <p>No complaints found</p>}

        {complaints.map((c) => (
          <div key={c.id} style={card}>
            <div style={cardHeader}>
              <strong>{c.subject}</strong>
              <span
                style={{
                  ...badge,
                  background: STATUS_COLORS[c.status],
                }}
              >
                {c.status}
              </span>
            </div>

            <p>{c.description}</p>

            {/* ADMIN ASSIGN */}
            {["SUPER_ADMIN", "PRESIDENT"].includes(ROLE) && (
              <div style={actionRow}>
                <select
                  onChange={(e) =>
                    setComplaints((prev) =>
                      prev.map((x) =>
                        x.id === c.id
                          ? { ...x, _assign: e.target.value }
                          : x
                      )
                    )
                  }
                >
                  <option value="">Assign to</option>
                  {OFFICE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>

                <button
                  style={btnPrimary}
                  onClick={() => assignComplaint(c.id, c._assign)}
                >
                  Assign
                </button>
              </div>
            )}

            {/* OFFICE UPDATE */}
            {OFFICE_ROLES.includes(ROLE) && (
              <div style={actionRow}>
                <select
                  onChange={(e) =>
                    setComplaints((prev) =>
                      prev.map((x) =>
                        x.id === c.id
                          ? { ...x, _status: e.target.value }
                          : x
                      )
                    )
                  }
                >
                  <option value="">Update Status</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>

                <button
                  style={btnSuccess}
                  onClick={() => updateStatus(c.id, c._status)}
                >
                  Save
                </button>
              </div>
            )}

            {/* ================= COMMENTS ================= */}
            <div style={{ marginTop: 12 }}>
              <button
                style={commentToggle}
                onClick={() => loadComments(c.id)}
              >
                💬 View Comments
              </button>

              {comments[c.id] && (
                <div style={commentBox}>
                  {comments[c.id].length === 0 && (
                    <p style={{ fontSize: 13 }}>No comments yet</p>
                  )}

                  {comments[c.id].map((cm, i) => (
                    <div key={i} style={commentItem}>
                      <strong>{cm.created_by}</strong>
                      <p>{cm.comment}</p>
                      <small>
                        {new Date(cm.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}

                  <textarea
                    style={commentInputStyle}
                    placeholder="Add comment..."
                    value={commentInput[c.id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [c.id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    style={btnPrimary}
                    onClick={() => addComment(c.id)}
                  >
                    Add Comment
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================
   🎨 STYLES
========================= */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };

const dashboardRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
  gap: 16,
  marginBottom: 25,
};

const dashboardCard = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  textAlign: "center",
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 12,
  marginBottom: 16,
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const badge = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
};

const actionRow = { display: "flex", gap: 10, marginTop: 12 };

const input = { width: 320, padding: 8, marginBottom: 10 };
const textarea = { width: 320, height: 90, padding: 8 };

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnSuccess = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

/* COMMENTS */
const commentToggle = {
  background: "#e5e7eb",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const commentBox = {
  background: "#f8fafc",
  padding: 12,
  borderRadius: 10,
  marginTop: 8,
};

const commentItem = {
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: 6,
  marginBottom: 6,
};

const commentInputStyle = {
  width: "100%",
  minHeight: 60,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #cbd5f5",
  marginBottom: 8,
};
