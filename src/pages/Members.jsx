import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH MEMBERS
  ========================= */
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/members"); // ✅ FIXED
      setMembers(res.data || []);
    } catch (err) {
      console.error("FETCH MEMBERS ERROR 👉", err);
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* =========================
     BLOCK / UNBLOCK MEMBER
  ========================= */
  const toggleStatus = async (member) => {
    if (!window.confirm("Change member status?")) return;

    try {
      await api.patch(`/members/${member.id}/status`, {
        active: !member.active,
      }); // ✅ FIXED
      fetchMembers();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  /* =========================
     DELETE MEMBER
  ========================= */
  const deleteMember = async (id) => {
    if (!window.confirm("Delete member permanently?")) return;

    try {
      await api.delete(`/members/${id}`); // ✅ FIXED
      fetchMembers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* =========================
     SAVE MEMBER (EDIT)
  ========================= */
  const saveMember = async () => {
    if (!window.confirm("Update this member?")) return;

    try {
      await api.put(`/members/${editing.id}`, {
        name: editing.name,
        phone: editing.phone,
        address: editing.address,
        role: editing.role,
        active: editing.active,
      }); // ✅ FIXED

      alert("Member updated successfully");
      setEditing(null);
      fetchMembers();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2 style={title}>Members</h2>

        {loading ? (
          <p>Loading members...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {members.map((m, i) => (
                  <tr key={m.id} style={i % 2 ? rowAlt : null}>
                    <td><span style={idBadge}>{m.id}</span></td>
                    <td><span style={idBadge}>{m.member_id}</span></td>
                    <td>{m.name}</td>
                    <td>{m.personal_email || "-"}</td>
                    <td>{m.phone || "-"}</td>
                    <td>{m.address || "-"}</td>

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
                      {m.role !== "SUPER_ADMIN" ? (
                        <>
                          <button
                            style={editBtn}
                            onClick={() => setEditing({ ...m })}
                          >
                            Edit
                          </button>

                          <button
                            style={m.active ? blockBtn : unblockBtn}
                            onClick={() => toggleStatus(m)}
                          >
                            {m.active ? "Block" : "Unblock"}
                          </button>

                          <button
                            style={deleteBtn}
                            onClick={() => deleteMember(m.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
         EDIT MODAL
      ========================= */}
      {editing && (
        <div style={modalBg}>
          <div style={modal}>
            <h3>Edit Member</h3>

            <label style={label}>Member ID</label>
            <div style={readonlyBox}>{editing.member_id}</div>

            <input
              placeholder="Full Name"
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              value={editing.phone || ""}
              onChange={(e) =>
                setEditing({ ...editing, phone: e.target.value })
              }
            />

            <textarea
              placeholder="Address"
              value={editing.address || ""}
              onChange={(e) =>
                setEditing({ ...editing, address: e.target.value })
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
              <option value="GENERAL_SECRETARY">GENERAL_SECRETARY</option>
              <option value="JOINT_SECRETARY">JOINT_SECRETARY</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) =>
                  setEditing({ ...editing, active: e.target.checked })
                }
              />{" "}
              Active
            </label>

            <div style={{ textAlign: "right", marginTop: 10 }}>
              <button style={saveBtn} onClick={saveMember}>Save</button>{" "}
              <button style={cancelBtn} onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
