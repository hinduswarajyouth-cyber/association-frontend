import React, { useEffect, useState } from "react";
import api from "../api/api";

/* =========================
   🔐 GET ROLE FROM JWT
========================= */
const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
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
  IN_PROGRESS: "#60a5fa",
  RESOLVED: "#86efac",
  CLOSED: "#e5e7eb",
};

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [expanded, setExpanded] = useState(null);

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

    if (ROLE === "SUPER_ADMIN" || ROLE === "PRESIDENT") {
      api.get("/api/complaints/stats").then((res) => {
        setDashboard(res.data);
      });
    }
  }, []);

  const loadComplaints = async () => {
    try {
      if (ROLE === "MEMBER") {
        setComplaints((await api.get("/api/complaints/my")).data);
      } else if (OFFICE_ROLES.includes(ROLE)) {
        setComplaints((await api.get("/api/complaints/assigned")).data);
      } else {
        setComplaints((await api.get("/api/complaints/all")).data);
      }
    } catch (err) {
      console.error("LOAD COMPLAINTS ERROR", err);
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

  return (
    <div style={page}>
      <h2>Complaint Management</h2>

      {/* ================= DASHBOARD ================= */}
      {dashboard && (
        <div style={dashboardRow}>
          {Object.entries(dashboard).map(([k, v]) => (
            <div key={k} style={dashboardCard}>
              <div>{k.replace("_", " ").toUpperCase()}</div>
              <strong>{v}</strong>
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
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
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
            Submit
          </button>
        </div>
      )}

      {/* ================= LIST ================= */}
      <h3>Complaints</h3>

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
          {(ROLE === "SUPER_ADMIN" || ROLE === "PRESIDENT") && (
            <div style={actionRow}>
              <select
                onChange={(e) =>
                  setComplaints((prev) =>
                    prev.map((x) =>
                      x.id === c.id ? { ...x, _assign: e.target.value } : x
                    )
                  )
                }
              >
                <option value="">Assign</option>
                {OFFICE_ROLES.map((r) => (
                  <option key={r}>{r.replace("_", " ")}</option>
                ))}
              </select>

              <button
                style={btnPrimary}
                onClick={() => assignComplaint(c.id, c._assign)}
              >
                Save
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
                      x.id === c.id ? { ...x, _status: e.target.value } : x
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
        </div>
      ))}
    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };

const dashboardRow = { display: "flex", gap: 16, marginBottom: 20 };

const dashboardCard = {
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  minWidth: 120,
  textAlign: "center",
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  marginBottom: 16,
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
};

const badge = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
};

const actionRow = { display: "flex", gap: 10, marginTop: 10 };

const input = { width: 300, padding: 8, marginBottom: 10 };
const textarea = { width: 300, height: 80, padding: 8 };

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const btnSuccess = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
};
