import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   🔐 ROLE FROM STORAGE
========================= */
const getRole = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.role || null;
  } catch {
    return null;
  }
};

const ROLE = getRole();

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

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

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

    if (ADMIN_ROLES.includes(ROLE)) {
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
    if (!form.subject || !form.description) {
      alert("Subject & description required");
      return;
    }

    await api.post("/api/complaints/create", form);
    setForm({ subject: "", description: "", priority: "NORMAL" });
    loadComplaints();
  };

  /* =========================
     PRESIDENT → ASSIGN
  ========================= */
  const assignComplaint = async (id, role) => {
    await api.put(`/api/complaints/assign/${id}`, { assigned_role: role });
    loadComplaints();
  };

  /* =========================
     OFFICE → UPDATE STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    await api.put(`/api/complaints/update/${id}`, { status });
    loadComplaints();
  };

  /* =========================
     PRESIDENT → CLOSE
  ========================= */
  const closeComplaint = async (id) => {
    if (!window.confirm("Close this complaint?")) return;
    await api.put(`/api/complaints/close/${id}`);
    loadComplaints();
  };

  /* =========================
     COMMENTS
  ========================= */
  const loadComments = async (id) => {
    const res = await api.get(`/api/complaints/${id}/comments`);
    setComments((p) => ({ ...p, [id]: res.data || [] }));
  };

  const addComment = async (id) => {
    await api.post(`/api/complaints/comment/${id}`, {
      comment: commentInput[id],
    });
    setCommentInput((p) => ({ ...p, [id]: "" }));
    loadComments(id);
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2>📮 Complaint Management</h2>

        {/* DASHBOARD */}
        {dashboard && (
          <div style={dashboardRow}>
            {Object.entries(dashboard).map(([k, v]) => (
              <div key={k} style={dashboardCard}>
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
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
            style={textarea}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button style={btnPrimary} onClick={submitComplaint}>
            Submit
          </button>
        </div>

        {/* LIST */}
        {loading && <p>Loading...</p>}
        {complaints.map((c) => (
          <div key={c.id} style={card}>
            <div style={cardHeader}>
              <strong>{c.subject}</strong>
              <span style={{ ...badge, background: STATUS_COLORS[c.status] }}>
                {c.status}
              </span>
            </div>

            <p>{c.description}</p>

            {/* ASSIGN */}
            {ADMIN_ROLES.includes(ROLE) && c.status !== "CLOSED" && (
              <select onChange={(e) => assignComplaint(c.id, e.target.value)}>
                <option>Assign to</option>
                {OFFICE_ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            )}

            {/* OFFICE STATUS */}
            {OFFICE_ROLES.includes(ROLE) && (
              <select onChange={(e) => updateStatus(c.id, e.target.value)}>
                <option>Update status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            )}

            {/* PRESIDENT CLOSE */}
            {ADMIN_ROLES.includes(ROLE) && c.status === "RESOLVED" && (
              <button style={btnDanger} onClick={() => closeComplaint(c.id)}>
                Close Complaint
              </button>
            )}

            {/* COMMENTS */}
            <button style={commentToggle} onClick={() => loadComments(c.id)}>
              💬 Comments
            </button>

            {comments[c.id]?.map((cm, i) => (
              <div key={i} style={commentItem}>
                <strong>{cm.created_by}</strong>
                <p>{cm.comment}</p>
              </div>
            ))}

            {OFFICE_ROLES.includes(ROLE) && (
              <>
                <textarea
                  style={commentInputStyle}
                  value={commentInput[c.id] || ""}
                  onChange={(e) =>
                    setCommentInput({ ...commentInput, [c.id]: e.target.value })
                  }
                />
                <button onClick={() => addComment(c.id)}>Add Comment</button>
              </>
            )}
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
const dashboardRow = { display: "flex", gap: 16 };
const dashboardCard = { background: "#fff", padding: 16, borderRadius: 12 };
const card = { background: "#fff", padding: 18, borderRadius: 12, marginBottom: 16 };
const cardHeader = { display: "flex", justifyContent: "space-between" };
const badge = { padding: "4px 10px", borderRadius: 12 };
const input = { width: 320, padding: 8 };
const textarea = { width: 320, height: 90, padding: 8 };
const btnPrimary = { background: "#2563eb", color: "#fff", padding: "8px 16px" };
const btnDanger = { background: "#dc2626", color: "#fff", padding: "6px 12px" };
const commentToggle = { marginTop: 10 };
const commentItem = { borderTop: "1px solid #e5e7eb", marginTop: 6 };
const commentInputStyle = { width: "100%", height: 60 };
