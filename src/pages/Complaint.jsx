import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* ===== CHART IMPORTS ===== */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

/* ================= ROLES ================= */
const USER = JSON.parse(localStorage.getItem("user")) || {};
const ROLE = USER?.role || "MEMBER";

const ADMIN = ["SUPER_ADMIN", "PRESIDENT"];
const OFFICE = [
  "VICE_PRESIDENT",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
  "EC_MEMBER",
];

/* ================= STATUS META ================= */
const STATUS_META = {
  OPEN: { color: "#f59e0b", icon: "📂" },
  FORWARDED: { color: "#3b82f6", icon: "📤" },
  IN_PROGRESS: { color: "#6366f1", icon: "⏳" },
  RESOLVED: { color: "#22c55e", icon: "✅" },
  CLOSED: { color: "#64748b", icon: "🔒" },
  SLA_MISSED: { color: "#ef4444", icon: "⚠️" },
};

/* ================= COMPONENT ================= */
export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [comments, setComments] = useState({});
  const [text, setText] = useState({});
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    description: "",
    comment: "",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    load();
    if (ADMIN.includes(ROLE)) {
      api.get("/complaints/stats").then(r => setStats(r.data));
    }
  }, []);

  const load = async () => {
    let r;
    if (ROLE === "MEMBER") r = await api.get("/complaints/my");
    else if (OFFICE.includes(ROLE)) r = await api.get("/complaints/assigned");
    else r = await api.get("/complaints/all");
    setComplaints(r.data || []);
  };

  const post = (url, body) => api.put(url, body).then(load);

  /* ================= SLA ================= */
  const slaText = c => {
    if (!c.sla_days) return "No SLA";
    const end = new Date(c.created_at);
    end.setDate(end.getDate() + c.sla_days);
    const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return diff < 0
      ? `⚠️ Overdue by ${Math.abs(diff)} days`
      : `⏳ ${diff} days left`;
  };

  /* ================= CREATE ================= */
  const createComplaint = async () => {
    if (!form.subject || !form.description || !form.comment)
      return alert("All fields required");

    await api.post("/complaints/create", form);
    setForm({ subject: "", description: "", comment: "" });
    load();
  };

  /* ================= CHART DATA ================= */
  const chartData = stats
    ? Object.entries(stats).map(([k, v]) => ({
        name: k.replace("_", " "),
        value: v,
        fill: STATUS_META[k.toUpperCase()]?.color || "#94a3b8",
      }))
    : [];

  /* ================= UI ================= */
  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>📮 Complaint Management</h2>

        {/* ===== DASHBOARD CARDS ===== */}
        {stats && (
          <div style={dashGrid}>
            {Object.entries(stats).map(([k, v]) => {
              const meta = STATUS_META[k.toUpperCase()] || {};
              return (
                <div
                  key={k}
                  style={{
                    ...dashCard,
                    background: `linear-gradient(135deg, ${meta.color}, #00000025)`,
                  }}
                >
                  <div style={{ fontSize: 32 }}>{meta.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>
                      {k.replace("_", " ")}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{v}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== DASHBOARD CHART ===== */}
        {stats && (
          <div style={chartCard}>
            <h3 style={{ marginBottom: 10 }}>📊 Complaint Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ===== CREATE ===== */}
        {(ROLE === "MEMBER" || OFFICE.includes(ROLE)) && (
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
            <textarea
              style={textarea}
              placeholder="Initial Comment (mandatory)"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />
            <button style={btnPrimary} onClick={createComplaint}>
              Submit Complaint
            </button>
          </div>
        )}

        {/* ===== COMPLAINT LIST ===== */}
        {complaints.map(c => (
          <div key={c.id} style={cardAnimated}>
            <div style={cardHeader}>
              <b>{c.complaint_no} — {c.subject}</b>
              <span style={statusBadge(c.status)}>
                {STATUS_META[c.status]?.icon} {c.status}
              </span>
            </div>

            <p>{c.description}</p>
            <p>Assigned To: <b>{c.assigned_role || "Not Assigned"}</b></p>
            <p style={{ fontWeight: 600 }}>{slaText(c)}</p>

            {/* ===== ACTIONS (LOGIC UNCHANGED) ===== */}
            {ADMIN.includes(ROLE) && c.status === "OPEN" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Instruction"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <select
                  onChange={e =>
                    post(`/complaints/assign/${c.id}`, {
                      assigned_role: e.target.value,
                      comment: text[c.id],
                    })
                  }
                >
                  <option>Select Office</option>
                  {OFFICE.map(r => <option key={r}>{r}</option>)}
                </select>
              </>
            )}

            {OFFICE.includes(ROLE) && c.assigned_role === ROLE && c.status === "FORWARDED" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Acceptance comment"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button style={btnPrimary}
                  onClick={() => post(`/complaints/accept/${c.id}`, { comment: text[c.id] })}>
                  Accept
                </button>
              </>
            )}

            {OFFICE.includes(ROLE) && c.status === "IN_PROGRESS" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Resolution"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button style={btnSuccess}
                  onClick={() => post(`/complaints/resolve/${c.id}`, { comment: text[c.id] })}>
                  Resolve
                </button>
              </>
            )}

            {ROLE === "PRESIDENT" && c.status === "RESOLVED" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Closing remark"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button style={btnDanger}
                  onClick={() => post(`/complaints/close/${c.id}`, { comment: text[c.id] })}>
                  Close Complaint
                </button>
              </>
            )}

            {ROLE === "MEMBER" && c.status === "CLOSED" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Reopen reason"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button style={btnPrimary}
                  onClick={() => post(`/complaints/reopen/${c.id}`, { comment: text[c.id] })}>
                  Reopen
                </button>
              </>
            )}

            {/* ===== TIMELINE ===== */}
            <button style={btnGhost}
              onClick={() =>
                api.get(`/complaints/comments/${c.id}`)
                  .then(r => setComments(p => ({ ...p, [c.id]: r.data })))
              }>
              View Timeline
            </button>

            {comments[c.id]?.map((cm, i) => (
              <div key={i} style={timeline}>
                <div style={timelineDot} />
                <div>
                  <b>{cm.name}</b>
                  <span style={{ marginLeft: 6, fontSize: 12, color: "#64748b" }}>
                    ({cm.comment_type})
                  </span>
                  <p>{cm.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };

const dashGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 20,
  marginBottom: 30,
};

const dashCard = {
  color: "#fff",
  padding: 20,
  borderRadius: 18,
  display: "flex",
  gap: 16,
  alignItems: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,.15)",
};

const chartCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 18,
  marginBottom: 30,
  boxShadow: "0 15px 35px rgba(0,0,0,.08)",
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 18,
  marginBottom: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
};

const cardAnimated = {
  ...card,
  animation: "fadeIn .4s ease",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statusBadge = status => ({
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  color: "#fff",
  background: STATUS_META[status]?.color || "#64748b",
});

const input = { width: "100%", padding: 10, marginBottom: 8 };
const textarea = { width: "100%", height: 80, padding: 10, marginBottom: 8 };
const textareaSmall = { width: "100%", height: 60, marginTop: 6 };

const btnPrimary = { background: "#2563eb", color: "#fff", padding: "8px 16px", marginRight: 6 };
const btnSuccess = { background: "#16a34a", color: "#fff", padding: "8px 16px", marginRight: 6 };
const btnDanger = { background: "#dc2626", color: "#fff", padding: "8px 16px", marginRight: 6 };
const btnGhost = { background: "#e5e7eb", padding: "6px 12px", marginTop: 6 };

const timeline = {
  display: "flex",
  gap: 12,
  paddingLeft: 16,
  borderLeft: "3px solid #e5e7eb",
  marginTop: 12,
};

const timelineDot = {
  width: 10,
  height: 10,
  background: "#2563eb",
  borderRadius: "50%",
  marginTop: 6,
};
