import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerDashboard() {
  const [members, setMembers] = useState([]);
  const [publics, setPublics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("MEMBER");

  const loadAll = async () => {
    try {
      setLoading(true);

      const [mRes, pRes, sRes] = await Promise.all([
        api.get("/treasurer/pending-members"),
        api.get("/treasurer/pending-public"),
        api.get("/treasurer/summary"),
      ]);

      setMembers(mRes.data || []);
      setPublics(pRes.data || []);
      setSummary(sRes.data);
    } catch (err) {
      alert("Failed to load treasurer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const approve = async (id) => {
    if (!window.confirm("Approve this donation?")) return;

    try {
      if (tab === "MEMBER") {
        const r = await api.patch(`/treasurer/approve-member/${id}`);
        alert(`Approved\nReceipt: ${r.data.receipt}`);
      } else {
        await api.patch(`/treasurer/approve-public/${id}`);
        alert("Public donation approved");
      }
      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || "Approve failed");
    }
  };

  const rows = tab === "MEMBER" ? members : publics;

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2>💼 Treasurer Dashboard</h2>

        {/* SUMMARY */}
        {summary && (
          <div style={cardRow}>
            <div style={card}>
              <h4>Member Donations</h4>
              <p>{summary.member_count}</p>
            </div>
            <div style={card}>
              <h4>Public Donations</h4>
              <p>{summary.public_count}</p>
            </div>
            <div style={card}>
              <h4>Total Collection</h4>
              <p>₹{Number(summary.total_collection).toLocaleString("en-IN")}</p>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={tabs}>
          <button
            style={tab === "MEMBER" ? tabActive : tabBtn}
            onClick={() => setTab("MEMBER")}
          >
            👤 Member Donations
          </button>
          <button
            style={tab === "PUBLIC" ? tabActive : tabBtn}
            onClick={() => setTab("PUBLIC")}
          >
            🌍 Public Donations
          </button>
        </div>

        {/* TABLE */}
        {loading && <p>Loading…</p>}

        {!loading && rows.length === 0 && (
          <p>No pending {tab.toLowerCase()} donations 🎉</p>
        )}

        {!loading && rows.length > 0 && (
          <table style={table}>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Ref</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id}>
                  <td>{d.member_name || d.name || "Public"}</td>
                  <td>₹{Number(d.amount).toLocaleString("en-IN")}</td>
                  <td>{d.payment_mode}</td>
                  <td>{d.reference_no || "-"}</td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                  <td>
                    <button style={approveBtn} onClick={() => approve(d.id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* STYLES */
const page = { padding: 30 };
const cardRow = { display: "flex", gap: 20, marginBottom: 20 };
const card = { flex: 1, background: "#fff", padding: 20, borderRadius: 10 };
const tabs = { display: "flex", gap: 10, marginBottom: 15 };
const tabBtn = { padding: "8px 16px", borderRadius: 8, border: "1px solid #ccc" };
const tabActive = { ...tabBtn, background: "#2563eb", color: "#fff" };
const table = { width: "100%", background: "#fff", borderCollapse: "collapse" };
const approveBtn = { background: "#16a34a", color: "#fff", padding: "6px 12px", border: "none", borderRadius: 6 };
