import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data || []);
    } catch {
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const toggleStatus = async (m) => {
    if (!window.confirm("Change status?")) return;
    await api.patch(`/members/${m.id}/status`);
    fetchMembers();
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    await api.delete(`/members/${id}`);
    fetchMembers();
  };

  const resendLogin = async (id) => {
    try {
      await api.post(`/members/resend-login/${id}`);
      alert("Login details sent");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send login");
    }
  };

  const saveMember = async () => {
    try {
      await api.put(`/members/${editing.id}`, {
        name: editing.name,
        personal_email: editing.personal_email,
        phone: editing.phone,
        address: editing.address,
        role: editing.role,
        active: editing.active
      });
      setEditing(null);
      fetchMembers();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h2>Members</h2>

        {loading ? <p>Loading...</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Member ID</th>
                <th>Name</th>
                <th>Association ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.member_id}</td>
                  <td>{m.name}</td>
                  <td className="assoc">{m.association_id}</td>
                  <td>{m.personal_email || "-"}</td>
                  <td>{m.phone || "-"}</td>
                  <td><span className="role">{m.role}</span></td>
                  <td>
                    <span className={m.active ? "active" : "blocked"}>
                      {m.active ? "ACTIVE" : "BLOCKED"}
                    </span>
                  </td>

                  <td className="actions">
                    {m.role !== "SUPER_ADMIN" ? (
                      <>
                        <button onClick={() => setEditing({ ...m })}>Edit</button>
                        <button onClick={() => toggleStatus(m)}>
                          {m.active ? "Block" : "Unblock"}
                        </button>
                        <button onClick={() => resendLogin(m.id)}>Resend</button>
                        <button className="danger" onClick={() => deleteMember(m.id)}>Delete</button>
                      </>
                    ) : (
                      <span>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="modalBg">
          <div className="modal">
            <h3>Edit Member</h3>

            <label>Member ID</label>
            <div className="readonly">{editing.member_id}</div>

            <label>Association ID</label>
            <div className="readonly">{editing.association_id}</div>

            <input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} />
            <input value={editing.personal_email||""} placeholder="Email" onChange={e=>setEditing({...editing,personal_email:e.target.value})} />
            <input value={editing.phone||""} placeholder="Phone" onChange={e=>setEditing({...editing,phone:e.target.value})} />
            <textarea value={editing.address||""} placeholder="Address" onChange={e=>setEditing({...editing,address:e.target.value})} />

            <select value={editing.role} onChange={e=>setEditing({...editing,role:e.target.value})}>
              <option>MEMBER</option>
              <option>EC_MEMBER</option>
              <option>TREASURER</option>
              <option>PRESIDENT</option>
              <option>VICE_PRESIDENT</option>
              <option>GENERAL_SECRETARY</option>
              <option>JOINT_SECRETARY</option>
            </select>

            <label><input type="checkbox" checked={editing.active} onChange={e=>setEditing({...editing,active:e.target.checked})}/> Active</label>

            <div className="modalActions">
              <button onClick={saveMember}>Save</button>
              <button onClick={()=>setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .page{padding:30px;background:#f4f6f8}
        .table{width:100%;background:#fff;border-radius:10px;overflow:hidden}
        th,td{padding:10px;border-bottom:1px solid #eee}
        .assoc{color:#2563eb;font-weight:600}
        .role{background:#e0e7ff;padding:4px 8px;border-radius:6px}
        .active{background:#16a34a;color:#fff;padding:4px 10px;border-radius:999px}
        .blocked{background:#dc2626;color:#fff;padding:4px 10px;border-radius:999px}
        .actions button{margin-right:5px;padding:5px 10px;border-radius:6px;border:none;background:#2563eb;color:white}
        .actions .danger{background:#dc2626}
        .modalBg{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;justify-content:center;align-items:center}
        .modal{background:white;padding:20px;border-radius:10px;width:400px;display:flex;flex-direction:column;gap:10px}
        .readonly{background:#f1f5f9;padding:10px;border-radius:6px}
        .modalActions{text-align:right}
      `}</style>
    </>
  );
}
