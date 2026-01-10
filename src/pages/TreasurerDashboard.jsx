import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerDashboard(){
  const [members,setMembers]=useState([]);
  const [publics,setPublics]=useState([]);
  const [summary,setSummary]=useState(null);
  const [tab,setTab]=useState("MEMBER");

  const load=async()=>{
    const [m,p,s]=await Promise.all([
      api.get("/treasurer/pending-members"),
      api.get("/treasurer/pending-public"),
      api.get("/treasurer/summary")
    ]);
    setMembers(m.data);
    setPublics(p.data);
    setSummary(s.data);
  };

  useEffect(()=>{ load(); },[]);

  const approve=async(id)=>{
    if(tab==="MEMBER"){
      const r=await api.patch(`/treasurer/approve-member/${id}`);
      alert("Receipt: "+r.data.receipt);
    }else{
      await api.patch(`/treasurer/approve-public/${id}`);
      alert("Public approved");
    }
    load();
  };

  const rows = tab==="MEMBER"?members:publics;

  return(
    <>
    <Navbar/>
    <div style={{padding:30}}>
      <h2>💼 Treasurer Dashboard</h2>

      {summary && (
        <div style={{display:"flex",gap:20}}>
          <div>Member: {summary.member_count}</div>
          <div>Public: {summary.public_count}</div>
          <div>Total ₹{Number(summary.total_collection).toLocaleString()}</div>
        </div>
      )}

      <button onClick={()=>setTab("MEMBER")}>Members</button>
      <button onClick={()=>setTab("PUBLIC")}>Public</button>

      <table>
        <tbody>
        {rows.map(r=>(
          <tr key={r.id}>
            <td>{r.member_name||r.name}</td>
            <td>₹{r.amount}</td>
            <td>
              <button onClick={()=>approve(r.id)}>Approve</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
