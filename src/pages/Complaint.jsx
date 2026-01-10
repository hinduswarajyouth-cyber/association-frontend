import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

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

  /* ================= CREATE ================= */
  const createComplaint = async () => {
    if (!form.subject || !form.description || !form.comment)
      return alert("All fields required");

    await api.post("/complaints/create", form);
    setForm({ subject: "", description: "", comment: "" });
    load();
  };

  /* ================= UI ================= */
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
                <div style={{
                  height: 6,
                  width: `${Math.min(v * 20, 100)}%`,
                  background: "#2563eb",
                  borderRadius: 4,
                  transition: "width .5s"
                }} />
              </div>
            ))}
          </div>
        )}

        {/* CREATE */}
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

        {/* LIST */}
        {complaints.map(c => (
          <div key={c.id} style={cardAnimated}>
            <div style={cardHeader}>
              <b>{c.complaint_no} — {c.subject}</b>
              <span style={badge(c.status)}>{c.status}</span>
            </div>

            <p>{c.description}</p>
            <p>Assigned To: <b>{c.assigned_role || "Not Assigned"}</b></p>

            {/* ADMIN ASSIGN */}
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
                  <option>Assign Office</option>
                  {OFFICE.map(r => <option key={r}>{r}</option>)}
                </select>
              </>
            )}

            {/* OFFICE ACCEPT */}
            {OFFICE.includes(ROLE) &&
              c.assigned_role === ROLE &&
              c.status === "FORWARDED" && (
                <>
                  <textarea
                    style={textareaSmall}
                    placeholder="Acceptance comment"
                    onChange={e => setText({ ...text, [c.id]: e.target.value })}
                  />
                  <button style={btnPrimary}
                    onClick={() =>
                      post(`/complaints/accept/${c.id}`, { comment: text[c.id] })
                    }>
                    Accept
                  </button>
                </>
              )}

            {/* OFFICE RESOLVE */}
            {OFFICE.includes(ROLE) && c.status === "IN_PROGRESS" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Resolution"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button style={btnSuccess}
                  onClick={() =>
                    post(`/complaints/resolve/${c.id}`, { comment: text[c.id] })
                  }>
                  Resolve
                </button>
              </>
            )}

            {/* PRESIDENT CLOSE */}
            {ROLE === "PRESIDENT" && c.status === "RESOLVED" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Closing remark"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button style={btnDanger}
                  onClick={() =>
                    post(`/complaints/close/${c.id}`, { comment: text[c.id] })
                  }>
                  Close Complaint
                </button>
              </>
            )}

            {/* MEMBER REOPEN */}
            {ROLE === "MEMBER" && c.status === "CLOSED" && (
              <>
                <textarea
                  style={textareaSmall}
                  placeholder="Reopen reason"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button style={btnPrimary}
                  onClick={() =>
                    post(`/complaints/reopen/${c.id}`, { comment: text[c.id] })
                  }>
                  Reopen
                </button>
              </>
            )}

            {/* TIMELINE */}
            <button
              style={btnGhost}
              onClick={() =>
                api.get(`/complaints/comments/${c.id}`)
                  .then(r => setComments(p => ({ ...p, [c.id]: r.data })))
              }>
              View Timeline
            </button>

            {comments[c.id]?.map((cm, i) => (
              <div key={i} style={timeline}>
                <b>{cm.name}</b> ({cm.comment_type})
                <p>{cm.comment}</p>
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

const dashRow = { display: "flex", gap: 16, marginBottom: 20 };
const dashCard = {
  background: "#fff",
  padding: 16,
  borderRadius: 16,
  minWidth: 120,
  boxShadow: "0 6px 20px rgba(0,0,0,.08)",
  transition: "transform .3s",
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
  animation: "fadeIn .5s ease",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const badge = status => ({
  padding: "4px 12px",
  borderRadius: 999,
  background:
    status === "OPEN" ? "#fde68a" :
    status === "FORWARDED" ? "#bfdbfe" :
    status === "IN_PROGRESS" ? "#93c5fd" :
    status === "RESOLVED" ? "#86efac" :
    "#e5e7eb",
});

const input = { width: "100%", padding: 10, marginBottom: 8 };
const textarea = { width: "100%", height: 80, padding: 10, marginBottom: 8 };
const textareaSmall = { width: "100%", height: 60, marginTop: 6 };

const btnPrimary = { background: "#2563eb", color: "#fff", padding: "8px 16px", marginRight: 6 };
const btnSuccess = { background: "#16a34a", color: "#fff", padding: "8px 16px", marginRight: 6 };
const btnDanger = { background: "#dc2626", color: "#fff", padding: "8px 16px", marginRight: 6 };
const btnGhost = { background: "#e5e7eb", padding: "6px 12px", marginTop: 6 };

const timeline = {
  borderLeft: "3px solid #2563eb",
  paddingLeft: 10,
  marginTop: 8,
};
