import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const USER = JSON.parse(localStorage.getItem("user")) || {};
const ROLE = USER?.role || "MEMBER";

const ADMIN = ["SUPER_ADMIN", "PRESIDENT"];
const OFFICE = [
  "VICE_PRESIDENT",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
  "EC_MEMBER",
];

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [comments, setComments] = useState({});
  const [text, setText] = useState({});
  const [stats, setStats] = useState(null);

  // CREATE FORM STATE
  const [form, setForm] = useState({
    subject: "",
    description: "",
    comment: "",
  });

  useEffect(() => {
    load();
    if (ADMIN.includes(ROLE)) {
      api.get("/complaints/stats").then(r => setStats(r.data));
    }
  }, []);

  /* ================= LOAD ================= */
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
    if (!form.subject || !form.description || !form.comment) {
      alert("All fields required");
      return;
    }

    await api.post("/complaints/create", form);
    setForm({ subject: "", description: "", comment: "" });
    load();
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>📮 Complaint Management</h2>

        {/* DASHBOARD (ADMIN) */}
        {stats && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} style={{ padding: 16, background: "#fff", borderRadius: 10 }}>
                <b>{k.toUpperCase()}</b>
                <h3>{v}</h3>
              </div>
            ))}
          </div>
        )}

        {/* CREATE COMPLAINT (MEMBER + OFFICE) */}
        {(ROLE === "MEMBER" || OFFICE.includes(ROLE)) && (
          <div style={{ background: "#fff", padding: 20, marginBottom: 20 }}>
            <h3>Create Complaint</h3>

            <input
              placeholder="Subject"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              style={{ width: "100%", marginBottom: 8 }}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%", marginBottom: 8 }}
            />

            <textarea
              placeholder="Initial Comment (mandatory)"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              style={{ width: "100%", marginBottom: 8 }}
            />

            <button onClick={createComplaint}>Submit Complaint</button>
          </div>
        )}

        {/* EMPTY STATE */}
        {complaints.length === 0 && (
          <p style={{ color: "#666" }}>No complaints found.</p>
        )}

        {/* COMPLAINT LIST */}
        {complaints.map(c => (
          <div key={c.id} style={{ background: "#fff", marginBottom: 16, padding: 16 }}>
            <b>{c.complaint_no}</b> — {c.subject}
            <p>{c.description}</p>
            <p>Status: <b>{c.status}</b></p>
            <p>Assigned To: {c.assigned_role || "Not Assigned"}</p>

            {/* ADMIN ASSIGN */}
            {ADMIN.includes(ROLE) && c.status === "OPEN" && (
              <>
                <textarea
                  placeholder="Instruction (mandatory)"
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
                  <option value="">Assign Office</option>
                  {OFFICE.map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </>
            )}

            {/* OFFICE ACCEPT */}
            {OFFICE.includes(ROLE) &&
              c.assigned_role === ROLE &&
              c.status === "FORWARDED" && (
                <>
                  <textarea
                    placeholder="Acceptance comment"
                    onChange={e => setText({ ...text, [c.id]: e.target.value })}
                  />
                  <button
                    onClick={() =>
                      post(`/complaints/accept/${c.id}`, {
                        comment: text[c.id],
                      })
                    }
                  >
                    Accept
                  </button>
                </>
              )}

            {/* OFFICE RESOLVE */}
            {OFFICE.includes(ROLE) && c.status === "IN_PROGRESS" && (
              <>
                <textarea
                  placeholder="Resolution comment"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button
                  onClick={() =>
                    post(`/complaints/resolve/${c.id}`, {
                      comment: text[c.id],
                    })
                  }
                >
                  Resolve
                </button>
              </>
            )}

            {/* PRESIDENT CLOSE */}
            {ADMIN.includes(ROLE) && c.status === "PRESIDENT_REVIEW" && (
              <>
                <textarea
                  placeholder="Closing comment"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button
                  onClick={() =>
                    post(`/complaints/close/${c.id}`, {
                      comment: text[c.id],
                    })
                  }
                >
                  Close Complaint
                </button>
              </>
            )}

            {/* MEMBER REOPEN */}
            {ROLE === "MEMBER" && c.status === "CLOSED" && (
              <>
                <textarea
                  placeholder="Reopen reason"
                  onChange={e => setText({ ...text, [c.id]: e.target.value })}
                />
                <button
                  onClick={() =>
                    post(`/complaints/reopen/${c.id}`, {
                      comment: text[c.id],
                    })
                  }
                >
                  Reopen
                </button>
              </>
            )}

            {/* TIMELINE */}
            <button
              onClick={() =>
                api
                  .get(`/complaints/comments/${c.id}`)
                  .then(r =>
                    setComments(prev => ({ ...prev, [c.id]: r.data }))
                  )
              }
            >
              View Timeline
            </button>

            {comments[c.id]?.map((cm, i) => (
              <div key={i} style={{ borderLeft: "3px solid #2563eb", paddingLeft: 8 }}>
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
