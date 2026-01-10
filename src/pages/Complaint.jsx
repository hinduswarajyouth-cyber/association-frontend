import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const USER = JSON.parse(localStorage.getItem("user")) || {};
const ROLE = USER.role;

const ADMIN = ["SUPER_ADMIN", "PRESIDENT"];
const OFFICE = [
  "VICE_PRESIDENT",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
  "EC_MEMBER",
];

const STATUS_COLOR = {
  OPEN: "#facc15",
  FORWARDED: "#38bdf8",
  IN_PROGRESS: "#2563eb",
  RESOLVED: "#22c55e",
  CLOSED: "#9ca3af",
};

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [text, setText] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    let r;
    if (ROLE === "MEMBER") r = await api.get("/complaints/my");
    else if (OFFICE.includes(ROLE)) r = await api.get("/complaints/assigned");
    else r = await api.get("/complaints/all");
    setComplaints(r.data);
    setLoading(false);
  };

  const assign = async (id, role) => {
    if (!role) return;
    await api.put(`/complaints/assign/${id}`, {
      assigned_role: role,
      instruction: text[id],
    });
    setText({});
    load();
  };

  const progress = async (id, status) => {
    await api.put(`/complaints/progress/${id}`, {
      status,
      comment: text[id],
    });
    setText({});
    load();
  };

  const close = async id => {
    await api.put(`/complaints/close/${id}`);
    load();
  };

  const loadComments = async id => {
    const r = await api.get(`/complaints/comments/${id}`);
    setComments(p => ({ ...p, [id]: r.data }));
  };

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2 style={title}>📮 Complaint Management</h2>

        {loading && <p>Loading...</p>}

        {complaints.map(c => (
          <div key={c.id} style={card}>
            <div style={header}>
              <h3>{c.subject}</h3>
              <span
                style={{
                  ...status,
                  background: STATUS_COLOR[c.status],
                }}
              >
                {c.status}
              </span>
            </div>

            <p style={desc}>{c.description}</p>

            <p>
              <b>Assigned To:</b>{" "}
              {c.assigned_role ? c.assigned_role : "Not Assigned"}
            </p>

            {/* ADMIN ASSIGN */}
            {ADMIN.includes(ROLE) && c.status === "OPEN" && (
              <div style={block}>
                <textarea
                  style={textarea}
                  placeholder="Instruction"
                  onChange={e =>
                    setText({ ...text, [c.id]: e.target.value })
                  }
                />
                <select
                  style={select}
                  defaultValue=""
                  onChange={e => assign(c.id, e.target.value)}
                >
                  <option value="">Assign Office</option>
                  {OFFICE.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}

            {/* OFFICE ACTIONS */}
            {OFFICE.includes(ROLE) && c.assigned_role === ROLE && (
              <div style={block}>
                {c.status === "FORWARDED" && (
                  <button style={btnBlue}
                    onClick={() => progress(c.id, "IN_PROGRESS")}
                  >
                    Accept & Start
                  </button>
                )}

                {c.status === "IN_PROGRESS" && (
                  <>
                    <textarea
                      style={textarea}
                      placeholder="Resolution details"
                      onChange={e =>
                        setText({ ...text, [c.id]: e.target.value })
                      }
                    />
                    <button style={btnGreen}
                      onClick={() => progress(c.id, "RESOLVED")}
                    >
                      Mark Resolved
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ADMIN CLOSE */}
            {ADMIN.includes(ROLE) && c.status === "RESOLVED" && (
              <button style={btnGray} onClick={() => close(c.id)}>
                Close Complaint
              </button>
            )}

            {/* TIMELINE */}
            <button style={btnOutline} onClick={() => loadComments(c.id)}>
              View Timeline
            </button>

            {comments[c.id]?.map((cm, i) => (
              <div key={i} style={timeline}>
                <b>{cm.commented_by}</b> ({cm.comment_type})
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

const page = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: 30,
};

const title = { marginBottom: 20 };

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  marginBottom: 16,
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const status = {
  color: "#fff",
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 12,
};

const desc = { marginTop: 10, marginBottom: 10 };

const block = { marginTop: 12 };

const textarea = {
  width: "100%",
  height: 70,
  padding: 8,
  marginBottom: 8,
};

const select = {
  padding: 8,
  width: "100%",
};

const btnBlue = {
  background: "#2563eb",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
};

const btnGreen = {
  background: "#16a34a",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
};

const btnGray = {
  background: "#6b7280",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
};

const btnOutline = {
  marginTop: 10,
  background: "transparent",
  border: "1px solid #2563eb",
  padding: "6px 12px",
  borderRadius: 8,
};

const timeline = {
  borderLeft: "3px solid #2563eb",
  paddingLeft: 10,
  marginTop: 10,
};
