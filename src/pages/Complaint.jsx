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

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [dashboard, setDashboard] = useState(null);
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
      api.get("/admin/dashboard").then((res) => {
        setDashboard(res.data.complaints);
      });
    }
  }, []);

  const loadComplaints = async () => {
    try {
      if (ROLE === "MEMBER") {
        const res = await api.get("/api/complaints/my");
        setComplaints(res.data);
      } else if (OFFICE_ROLES.includes(ROLE)) {
        const res = await api.get("/api/complaints/assigned");
        setComplaints(res.data);
      } else {
        const res = await api.get("/api/complaints/all");
        setComplaints(res.data);
      }
    } catch (err) {
      console.error("LOAD COMPLAINTS ERROR", err);
    }
  };

  /* =========================
     CREATE COMPLAINT (MEMBER)
  ========================= */
  const submitComplaint = async () => {
    if (!form.subject || !form.description) {
      alert("Fill all fields");
      return;
    }

    await api.post("/api/complaints/create", form);
    alert("Complaint submitted");

    setForm({ subject: "", description: "", priority: "NORMAL" });
    loadComplaints();
  };

  /* =========================
     ASSIGN (ADMIN)
  ========================= */
  const assignComplaint = async (id, role) => {
    if (!role) {
      alert("Select role");
      return;
    }

    await api.put(`/api/complaints/assign/${id}`, {
      assigned_role: role,
    });

    loadComplaints();
  };

  /* =========================
     UPDATE STATUS (OFFICE)
  ========================= */
  const updateStatus = async (id, status) => {
    if (!status) {
      alert("Select status");
      return;
    }

    await api.put(`/api/complaints/update/${id}`, { status });
    loadComplaints();
  };

  return (
    <div style={{ padding: 25 }}>
      <h2>Complaint Management</h2>

      {/* ================= DASHBOARD ================= */}
      {(ROLE === "SUPER_ADMIN" || ROLE === "PRESIDENT") && dashboard && (
        <>
          <h3>Complaint Dashboard</h3>
          <div style={dashboardRow}>
            {Object.entries(dashboard).map(([key, value]) => (
              <div key={key} style={dashboardCard}>
                <div style={{ fontWeight: 700 }}>
                  {key.replace("_", " ").toUpperCase()}
                </div>
                <div style={{ fontSize: 22 }}>{value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= MEMBER CREATE ================= */}
      {ROLE === "MEMBER" && (
        <>
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
            <option value="NORMAL">NORMAL</option>
            <option value="HIGH">HIGH</option>
          </select>

          <button style={btnPrimary} onClick={submitComplaint}>
            Submit Complaint
          </button>
          <hr />
        </>
      )}

      {/* ================= COMPLAINT LIST ================= */}
      <h3>Complaints</h3>

      {complaints.length === 0 && <p>No complaints found</p>}

      {complaints.map((c) => (
        <div key={c.id} style={card}>
          <h4>{c.subject}</h4>
          <p>{c.description}</p>
          <p>
            Status: <b>{c.status}</b>
          </p>

          {/* ADMIN ASSIGN */}
          {(ROLE === "SUPER_ADMIN" || ROLE === "PRESIDENT") && (
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
                <option value="">Assign To</option>
                {OFFICE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>

              <button
                style={btnPrimary}
                onClick={() => assignComplaint(c.id, c._assign)}
              >
                Save Assignment
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
                Save Status
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
const dashboardRow = {
  display: "flex",
  gap: 15,
  marginBottom: 25,
};

const dashboardCard = {
  border: "1px solid #ddd",
  padding: 15,
  width: 140,
  textAlign: "center",
  borderRadius: 8,
  background: "#f8fafc",
};

const card = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 15,
  marginBottom: 15,
  background: "#fff",
};

const actionRow = {
  marginTop: 10,
  display: "flex",
  gap: 10,
};

const input = {
  display: "block",
  width: 300,
  padding: 8,
  marginBottom: 10,
};

const textarea = {
  display: "block",
  width: 300,
  height: 80,
  padding: 8,
  marginBottom: 10,
};

const btnPrimary = {
  padding: "6px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const btnSuccess = {
  padding: "6px 14px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};
