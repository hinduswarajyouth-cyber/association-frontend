import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerDashboard() {
  const [members, setMembers] = useState([]);
  const [publics, setPublics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [tab, setTab] = useState("MEMBER");
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    try{
      setLoading(true);
      const [m,p,s] = await Promise.all([
        api.get("/treasurer/pending-members"),
        api.get("/treasurer/pending-public"),
        api.get("/treasurer/summary"),
      ]);
      setMembers(m.data);
      setPublics(p.data);
      setSummary(s.data);
    }catch{
      alert("Failed to load treasurer data");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ loadAll(); },[]);

  const approve = async (id)=>{
    try{
      if(tab==="MEMBER"){
        await api.patch(`/treasurer/approve-member/${id}`);
        alert("Member approved");
      }else{
        await api.patch(`/treasurer/approve-public/${id}`);
        alert("Public approved");
      }
      loadAll();
    }catch(err){
      alert(err.response?.data?.error || "Approve failed");
    }
  };

  const rows = tab==="MEMBER" ? members : publics;

  return (
    <>
      <Navbar />
      <div style={{padding:30}}>
        <h2>💼 Treasurer Dashboard</h2>

        {summary && (
          <div style={{display:"flex",gap:20,marginBottom:20}}>
            <div style={card}>Member<br/><b>{summary.member_count}</b></div>
            <div style={card}>Public<br/><b>{summary.public_count}</b></div>
            <div style={card}>Total<br/><b>₹{Number(summary.total_collection).toLocaleString("en-IN")}</b></div>
          </div>
        )}

        <div style={{marginBottom:15}}>
          <button onClick={()=>setTab("MEMBER")} style={tab==="MEMBER"?active:btn}>👤 Members</button>
          <button onClick={()=>setTab("PUBLIC")} style={tab==="PUBLIC"?active:btn}>🌍 Public</button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && rows.length===0 && <p>No pending {tab.toLowerCase()} donations 🎉</p>}

        {!loading && rows.length>0 && (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Ref</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(d=>(
                <tr key={d.id}>
                  <td>{d.member_name || d.donor_name || "Public"}</td>
                  <td>₹{Number(d.amount).toLocaleString("en-IN")}</td>
                  <td>{d.payment_mode}</td>
                  <td>{d.reference_no || "-"}</td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                  <td><button onClick={()=>approve(d.id)}>Approve</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const card={background:"#fff",padding:20,borderRadius:10};
const btn={padding:"8px 16px",marginRight:10};
const active={...btn,background:"#2563eb",color:"#fff"};
