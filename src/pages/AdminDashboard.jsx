import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD DASHBOARD
  ========================= */
  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard"),
      api.get("/api/announcements"),
      api.get("/api/suggestions/dashboard"),
    ])
      .then(([dashboardRes, annRes, sugRes]) => {
        setData(dashboardRes.data);
        setAnnouncements(annRes.data.slice(0, 5));
        setSuggestions(sugRes.data.slice(0, 5));
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={page}>Loading dashboard...</div>
      </>
    );
  }

  /* ===== ERROR ===== */
  if (error || !data) {
    return (
      <>
        <Navbar />
        <div style={page} className="text-red-500">
          {error}
        </div>
      </>
    );
  }

  const recentReceipts = Array.isArray(data.recentContributions)
    ? data.recentContributions
    : [];

  return (
    <>
      <Navbar />

      <div style={page}>
        <h1 style={pageTitle}>Admin Dashboard</h1>

        {/* ===== STATS ===== */}
        <div style={cardsGrid}>
          <StatCard title="Members" value={data.totalMembers} />
          <StatCard title="Approved Receipts" value={data.approvedReceipts} />
          <StatCard
            title="Total Collection"
            value={`₹${Number(data.totalCollection).toLocaleString("en-IN")}`}
          />
          <StatCard title="Cancelled Receipts" value={data.cancelledReceipts} />
        </div>

        {/* ===== ACTIONS ===== */}
        <div style={actions}>
          <button style={primaryBtn} onClick={() => navigate("/members")}>
            View Members
          </button>
          <button style={secondaryBtn} onClick={() => navigate("/add-member")}>
            Add Member
          </button>
          <button style={auditBtn} onClick={() => navigate("/audit-logs")}>
            Audit Logs
          </button>
        </div>

        {/* ===== ANNOUNCEMENTS ===== */}
        <div style={card}>
          <h3>📢 Latest Announcements</h3>
          {announcements.length === 0 ? (
            <p>No announcements</p>
          ) : (
            <ul>
              {announcements.map((a) => (
                <li key={a.id}>
                  <b>{a.title}</b> — {a.message}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== SUGGESTIONS ===== */}
        <div style={card}>
          <h3>💡 Latest Suggestions</h3>
          {suggestions.length === 0 ? (
            <p>No suggestions</p>
          ) : (
            <ul>
              {suggestions.map((s) => (
                <li key={s.id}>
                  <b>{s.member_name}</b> — {s.message}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== RECEIPTS ===== */}
        <div style={tableCard}>
          <h3>Recent Receipts</h3>
          {recentReceipts.length === 0 ? (
            <p>No receipts</p>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Receipt</th>
                  <th style={th}>Member</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReceipts.map((r, i) => (
                  <tr key={i}>
                    <td style={td}>{r.receipt_no}</td>
                    <td style={td}>{r.member_name}</td>
                    <td style={td}>₹{r.amount}</td>
                    <td style={td}>
                      {new Date(r.receipt_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

/* ===== SMALL COMPONENT ===== */
function StatCard({ title, value }) {
  return (
    <div style={card}>
      <span style={cardTitle}>{title}</span>
      <span style={cardValue}>{value}</span>
    </div>
  );
}

/* ===== STYLES ===== */
const page = {
  padding: 30,
  background: "#f1f5f9",
  minHeight: "100vh",
};

const pageTitle = { fontSize: 26, fontWeight: 700 };
const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 20,
};
const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};
const cardTitle = { fontSize: 14, color: "#64748b" };
const cardValue = { fontSize: 28, fontWeight: 700 };

const actions = { display: "flex", gap: 12, marginBottom: 30 };
const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: 10,
  borderRadius: 8,
};
const secondaryBtn = {
  background: "#e2e8f0",
  padding: 10,
  borderRadius: 8,
};
const auditBtn = {
  background: "#0f172a",
  color: "#fff",
  padding: 10,
  borderRadius: 8,
};

const tableCard = { background: "#fff", padding: 20, borderRadius: 12 };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { padding: 10, borderBottom: "1px solid #e2e8f0" };
const td = { padding: 10, borderBottom: "1px solid #f1f5f9" };
