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
  const [text, setText] = useState({});
  const [comments, setComments] = useState({});
  const [stats, setStats] = useState(null);

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
    setComplaints(r.data);
  };

  const post = (url, body) => api.put(url, body).then(load);

  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>📮 Complaint Management</h2>

        {stats && (
          <div style={{ display: "flex", gap: 12 }}>
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} style={{ padding: 16, background: "#fff" }}>
                <b>{k.toUpperCase()}</b>
                <h3>{v}</h3>
              </div>
            ))}
          </div>
        )}

        {complaints.map(c => (
          <div key={c.id} style={{ background: "#fff", margin: 16, padding: 16 }}>
            <b>{c.complaint_no}</b> — {c.subject}
            <p>{c.description}</p>
            <p>Status: {c.status}</p>

            {ADMIN.includes(ROLE) && c.status === "OPEN" && (
              <>
                <textarea onChange={e => setText({ ...text, [c.id]: e.target.value })} />
                <select onChange={e => post(`/complaints/assign/${c.id}`, {
                  assigned_role: e.target.value,
                  comment: text[c.id]
                })}>
                  <option>Assign</option>
                  {OFFICE.map(r => <option key={r}>{r}</option>)}
                </select>
              </>
            )}

            {OFFICE.includes(ROLE) && c.assigned_role === ROLE && c.status === "FORWARDED" && (
              <>
                <textarea onChange={e => setText({ ...text, [c.id]: e.target.value })} />
                <button onClick={() => post(`/complaints/accept/${c.id}`, { comment: text[c.id] })}>
                  Accept
                </button>
              </>
            )}

            {OFFICE.includes(ROLE) && c.status === "IN_PROGRESS" && (
              <>
                <textarea onChange={e => setText({ ...text, [c.id]: e.target.value })} />
                <button onClick={() => post(`/complaints/resolve/${c.id}`, { comment: text[c.id] })}>
                  Resolve
                </button>
              </>
            )}

            {ROLE === "MEMBER" && c.status === "CLOSED" && (
              <>
                <textarea onChange={e => setText({ ...text, [c.id]: e.target.value })} />
                <button onClick={() => post(`/complaints/reopen/${c.id}`, { comment: text[c.id] })}>
                  Reopen
                </button>
              </>
            )}

            <button onClick={() =>
              api.get(`/complaints/comments/${c.id}`)
                .then(r => setComments(p => ({ ...p, [c.id]: r.data })))
            }>
              Timeline
            </button>

            {comments[c.id]?.map((cm, i) => (
              <div key={i}>
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
