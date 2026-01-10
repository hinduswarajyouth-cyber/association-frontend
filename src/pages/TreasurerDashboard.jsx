import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TreasurerDashboard() {
  const [members, setMembers] = useState([]);
  const [publics, setPublics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [tab, setTab] = useState("MEMBER");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [m, p, s] = await Promise.all([
        api.get("/treasurer/pending-members"),
        api.get("/treasurer/pending-public"),
        api.get("/treasurer/summary"),
      ]);

      setMembers(m.data || []);
      setPublics(p.data || []);
      setSummary(s.data);
    } catch (e) {
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
    } catch (e) {
      alert(e.response?.data?.error || "Approve failed");
    }
  };

  const rows = tab === "MEMBER" ? members : publics;

  const chartData = [
    { name: "Members", value: summary?.member_count || 0 },
    { name: "Public", value: summary?.public_count || 0 },
  ];

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>💼 Treasurer Dashboard</h2>

        {/* Cards */}
        {summary && (
          <div style={cards}>
            <Card title="Member Donations" value={summary.member_count} />
            <Card title="Public Donations" value={summary.public_count} />
            <Card
              title="Total Collection"
              value={`₹${Number(summary.total_collection).toLocaleString("en-IN")}`}
            />
          </div>
        )}

        {/* Graph */}
        <div style={graphCard}>
          <h4>Donation Sources</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
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

        {/* Table */}
        {loading && <p>Loading…</p>}

        {!loading && rows.length === 0 && (
          <p>No pending {tab.toLowerCase()} donations 🎉</p>
        )}

        {!loading && rows.length > 0 && (
          <div style={tableWrap}>
            <table style={table}>
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
                {rows.map((d) => (
                  <tr key={d.id}>
                   <td>{tab === "MEMBER" ? d.member_name : d.donor_name || "Public Donor"}</td>
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
          </div>
        )}
      </div>
    </>
  );
}

/* UI Components */
const Card = ({ title, value }) => (
  <div style={card}>
    <h4>{title}</h4>
    <p style={cardNum}>{value}</p>
  </div>
);

/* Styles */
const page = { padding: 30, background: "#f8fafc", minHeight: "100vh" };

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
  marginBottom: 30,
};

const card = {
  background: "#fff",
  padding: 24,
  borderRadius: 14,
  boxShadow: "0 8px 20px rgba(0,0,0,.06)",
};

const cardNum = { fontSize: 26, fontWeight: "bold", marginTop: 8 };

const graphCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  marginBottom: 30,
  boxShadow: "0 8px 20px rgba(0,0,0,.06)",
};

const tabs = { display: "flex", gap: 10, marginBottom: 15 };

const tabBtn = {
  padding: "10px 18px",
  borderRadius: 10,
  border: "1px solid #c7d2fe",
  background: "#fff",
  cursor: "pointer",
};

const tabActive = { ...tabBtn, background: "#2563eb", color: "#fff" };

const tableWrap = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 20px rgba(0,0,0,.06)",
  overflow: "hidden",
};

const table = { width: "100%", borderCollapse: "collapse" };

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  padding: "6px 14px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
