import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  /* =========================
     FETCH MEMBERS
  ========================= */
  const fetchMembers = async () => {
    const res = await api.get("/members");
    setMembers(res.data);
  };

  /* =========================
     RESEND LOGIN
  ========================= */
  const resendLogin = async (id) => {
    if (!window.confirm("Resend login credentials?")) return;
    await api.post(`/admin/resend-login/${id}`);
    alert("Login credentials sent");
  };

  /* =========================
     BLOCK / UNBLOCK
  ========================= */
  const toggleStatus = async (id, active) => {
    await api.put(`/admin/block-member/${id}`, { active });
    fetchMembers();
  };

  /* =========================
     DELETE MEMBER
  ========================= */
  const deleteMember = async (id) => {
    if (!window.confirm("Delete member permanently?")) return;
    await api.delete(`/admin/delete-member/${id}`);
    fetchMembers();
  };

  /* =========================
     SAVE MEMBER (SAFE)
  ========================= */
  const saveMember = async () => {
    if (
      !window.confirm(
        "Are you sure you want to update this member details?"
      )
    ) {
      return;
    }

    await api.put(`/admin/edit-member/${editing.id}`, {
      name: editing.name,
      personal_email: editing.personal_email,
      phone: editing.phone,
      role: editing.role,
      active: editing.active,
    });

    alert("Member updated successfully");
    setEditing(null);
    fetchMembers();
  };

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2 style={title}>Members</h2>

        <table style={table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Association ID</th>
              <th>Personal Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m, index) => (
              <tr key={m.id} style={index % 2 ? rowAlt : null}>
                <td>{m.name}</td>

                <td>
                  <span style={idBadge}>{m.member_id}</span>
                </td>

                <td>{m.personal_email || "-"}</td>

                <td>
                  <span style={roleBadge}>{m.role}</span>
                </td>

                <td>
                  <span
                    style={{
                      ...statusBadge,
                      background: m.active ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {m.active ? "ACTIVE" : "BLOCKED"}
                  </span>
                </td>

                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    style={editBtn}
                    onClick={() => setEditing({ ...m })}
                  >
                    Edit
                  </button>

                  <button
                    style={mailBtn}
                    onClick={() => resendLogin(m.id)}
                  >
                    Resend
                  </button>

                  <button
                    style={m.active ? blockBtn : unblockBtn}
                    onClick={() => toggleStatus(m.id, !m.active)}
                  >
                    {m.active ? "Block" : "Unblock"}
                  </button>

                  {m.role !== "SUPER_ADMIN" && (
                    <button
                      style={deleteBtn}
                      onClick={() => deleteMember(m.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
         EDIT MODAL
      ========================= */}
      {editing && (
        <div style={modalBg}>
          <div style={modal}>
            <h3>Edit Member</h3>

            {/* READ ONLY ASSOCIATION ID */}
            <div>
              <label style={label}>Association ID</label>
              <div style={readonlyBox}>
                🔒 {editing.member_id}
              </div>
              <small style={hint}>
                System generated – cannot be edited
              </small>
            </div>

            <input
              placeholder="Full Name"
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
            />

            <input
              placeholder="Personal Email"
              value={editing.personal_email || ""}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  personal_email: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              value={editing.phone || ""}
              onChange={(e) =>
                setEditing({ ...editing, phone: e.target.value })
              }
            />

            <select
              value={editing.role}
              onChange={(e) =>
                setEditing({ ...editing, role: e.target.value })
              }
            >
              <option value="MEMBER">MEMBER</option>
              <option value="EC_MEMBER">EC_MEMBER</option>
              <option value="TREASURER">TREASURER</option>
              <option value="PRESIDENT">PRESIDENT</option>
              <option value="VICE_PRESIDENT">VICE_PRESIDENT</option>
              <option value="GENERAL_SECRETARY">
                GENERAL_SECRETARY
              </option>
              <option value="JOINT_SECRETARY">
                JOINT_SECRETARY
              </option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    active: e.target.checked,
                  })
                }
              />{" "}
              Active
            </label>

            <div style={{ textAlign: "right", marginTop: 10 }}>
              <button style={saveBtn} onClick={saveMember}>
                Save
              </button>{" "}
              <button
                style={cancelBtn}
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   STYLES
========================= */
const container = {
  padding: 30,
  background: "#f4f6f8",
  minHeight: "100vh",
  fontFamily: "Segoe UI, sans-serif",
};

const title = { marginBottom: 20 };

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
};

const rowAlt = { background: "#f9fafb" };

const statusBadge = {
  padding: "4px 12px",
  borderRadius: 999,
  color: "#fff",
  fontSize: 12,
  fontWeight: "bold",
};

const roleBadge = {
  padding: "4px 10px",
  borderRadius: 6,
  background: "#e0e7ff",
  color: "#1e3a8a",
  fontSize: 12,
  fontWeight: 600,
};

const idBadge = {
  background: "#ecfeff",
  color: "#155e75",
  padding: "4px 10px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
};

const baseBtn = {
  padding: "5px 10px",
  borderRadius: 6,
  border: "none",
  fontSize: 12,
  cursor: "pointer",
  marginRight: 6,
};

const editBtn = { ...baseBtn, background: "#2563eb", color: "#fff" };
const mailBtn = { ...baseBtn, background: "#0ea5e9", color: "#fff" };
const blockBtn = { ...baseBtn, background: "#f97316", color: "#fff" };
const unblockBtn = { ...baseBtn, background: "#16a34a", color: "#fff" };
const deleteBtn = { ...baseBtn, background: "#dc2626", color: "#fff" };
const saveBtn = { ...baseBtn, background: "#16a34a", color: "#fff" };
const cancelBtn = { ...baseBtn, background: "#6b7280", color: "#fff" };

const modalBg = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  width: 380,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const label = {
  fontSize: 12,
  fontWeight: 600,
  color: "#475569",
};

const readonlyBox = {
  padding: "10px 12px",
  borderRadius: 8,
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  fontSize: 14,
  fontWeight: 600,
  color: "#0f172a",
};

const hint = {
  fontSize: 11,
  color: "#64748b",
};
