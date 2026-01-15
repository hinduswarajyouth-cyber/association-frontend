import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== ADD MEMBER STATES ===== */
  const [adding, setAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    personal_email: "",
    phone: "",
    role: "MEMBER"
  });

  /* ===== LOAD MEMBERS ===== */
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

  /* ===== ACTIONS ===== */
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

  /* ===== CREATE MEMBER ===== */
  const createMember = async () => {
    if (!newMember.name || !newMember.personal_email) {
      return alert("Name & Email required");
    }

    try {
      await api.post("/members/create", newMember);
      setAdding(false);
      setNewMember({
        name: "",
        personal_email: "",
        phone: "",
        role: "MEMBER"
      });
      fetchMembers();
    } catch {
      alert("Failed to create member");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">

        {/* ===== HEADER WITH ADD BUTTON ===== */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2>Members</h2>
          <button
            style={{
              background:"#2563eb",
              color:"#fff",
              padding:"10px 20px",
              borderRadius:999,
              border:"none",
              fontWeight:700,
              cursor:"pointer"
            }}
            onClick={() => setAdding(true)}
          >
            ➕ Add Member
          </button>
        </div>

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

      {/* ===== EDIT MEMBER MODAL ===== */}
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

            <label>
              <input type="checkbox"
                checked={editing.active}
                onChange={e=>setEditing({...editing,active:e.target.checked})}
              /> Active
            </label>

            <div className="modalActions">
              <button onClick={saveMember}>Save</button>
              <button onClick={()=>setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD MEMBER MODAL ===== */}
      {adding && (
        <div className="modalBg">
          <div className="modal">
            <h3>Add Member</h3>

            <input
              placeholder="Full Name"
              value={newMember.name}
              onChange={e=>setNewMember({...newMember,name:e.target.value})}
            />

            <input
              placeholder="Email"
              value={newMember.personal_email}
              onChange={e=>setNewMember({...newMember,personal_email:e.target.value})}
            />

            <input
              placeholder="Phone"
              value={newMember.phone}
              onChange={e=>setNewMember({...newMember,phone:e.target.value})}
            />

            <select
              value={newMember.role}
              onChange={e=>setNewMember({...newMember,role:e.target.value})}
            >
              <option>MEMBER</option>
              <option>EC_MEMBER</option>
              <option>TREASURER</option>
              <option>PRESIDENT</option>
              <option>VICE_PRESIDENT</option>
              <option>GENERAL_SECRETARY</option>
              <option>JOINT_SECRETARY</option>
            </select>

            <div className="modalActions">
              <button onClick={createMember}>Create</button>
              <button onClick={()=>setAdding(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
/* ===== Page Background ===== */
.page{
  padding:40px;
  background:linear-gradient(135deg,#f8fafc,#eef2ff);
  min-height:100vh;
  font-family: Inter, system-ui, sans-serif;
}

/* ===== Title ===== */
h2{
  font-size:28px;
  font-weight:700;
  color:#0f172a;
  margin-bottom:20px;
}

/* ===== Premium Table Card ===== */
.table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  background:rgba(255,255,255,.75);
  backdrop-filter: blur(14px);
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 30px 60px rgba(0,0,0,.08);
}

/* ===== Header ===== */
.table thead{
  background:linear-gradient(135deg,#1e3a8a,#2563eb);
}

.table th{
  padding:16px;
  color:white;
  font-size:13px;
  text-transform:uppercase;
  letter-spacing:.05em;
}

/* ===== Rows ===== */
.table td{
  padding:14px;
  border-bottom:1px solid #e5e7eb;
  font-size:14px;
  color:#0f172a;
}

.table tbody tr{
  transition:.3s;
}

.table tbody tr:hover{
  background:#eef2ff;
}

/* ===== Association ID ===== */
.assoc{
  color:#2563eb;
  font-weight:600;
}

/* ===== Badges ===== */
.role{
  background:linear-gradient(135deg,#e0e7ff,#c7d2fe);
  color:#1e3a8a;
  padding:6px 14px;
  border-radius:999px;
  font-weight:600;
}

.active{
  background:linear-gradient(135deg,#16a34a,#22c55e);
  color:white;
  padding:6px 14px;
  border-radius:999px;
  font-weight:700;
}

.blocked{
  background:linear-gradient(135deg,#dc2626,#ef4444);
  color:white;
  padding:6px 14px;
  border-radius:999px;
  font-weight:700;
}

/* ===== Buttons ===== */
.actions button{
  border:none;
  border-radius:999px;
  padding:6px 14px;
  font-weight:600;
  margin-right:6px;
  cursor:pointer;
  transition:.25s;
  box-shadow:0 8px 18px rgba(0,0,0,.1);
}

.actions button:hover{
  transform:translateY(-2px);
  box-shadow:0 12px 30px rgba(0,0,0,.2);
}

.actions button:nth-child(1){background:#2563eb;color:#fff;}
.actions button:nth-child(2){background:#f97316;color:#fff;}
.actions button:nth-child(3){background:#7c3aed;color:#fff;}
.actions .danger{background:#dc2626;color:#fff;}

/* ===== Modal Glass Effect ===== */
.modalBg{
  background:rgba(0,0,0,.65);
  backdrop-filter:blur(6px);
}

.modal{
  background:white;
  padding:30px;
  border-radius:20px;
  width:460px;
  box-shadow:0 40px 90px rgba(0,0,0,.35);
}

.modal h3{
  font-size:22px;
  font-weight:700;
}

/* ===== Inputs ===== */
.modal input,
.modal textarea,
.modal select{
  padding:12px 14px;
  border-radius:12px;
  border:1px solid #c7d2fe;
  font-size:14px;
}

.modal input:focus,
.modal textarea:focus,
.modal select:focus{
  outline:none;
  border-color:#2563eb;
  box-shadow:0 0 0 4px rgba(37,99,235,.15);
}

/* ===== Readonly Fields ===== */
.readonly{
  background:#f1f5f9;
  border-radius:12px;
  padding:12px 14px;
  font-weight:600;
}

/* ===== Modal Buttons ===== */
.modalActions button{
  padding:10px 18px;
  border-radius:999px;
  border:none;
  font-weight:700;
  cursor:pointer;
}

.modalActions button:first-child{
  background:#16a34a;
  color:white;
}

.modalActions button:last-child{
  background:#64748b;
  color:white;
}
`}</style>

    </>
  );
}
