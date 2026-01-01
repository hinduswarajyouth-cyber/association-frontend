import { useState } from "react";
import api from "../api/api";

export default function AdminAddMember() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "MEMBER"
  });

  const submit = async () => {
    const res = await api.post("/admin/add-member", form);
    alert(`User created. Temp password: ${res.data.tempPassword}`);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Add Member</h2>

      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Phone" onChange={e=>setForm({...form,phone:e.target.value})}/>

      <select onChange={e=>setForm({...form,role:e.target.value})}>
        <option>MEMBER</option>
        <option>TREASURER</option>
        <option>ADMIN</option>
        <option>EC MEMBER</option>
        <option>JOINT SECRETERY</option>
        <option>GENERAL SECRETERY</option>
        <option>PRESIDENT</option>
        <option>VICE PRESIDENT</option>
      
      </select>

      <button onClick={submit}>Create</button>
    </div>
  );
}
