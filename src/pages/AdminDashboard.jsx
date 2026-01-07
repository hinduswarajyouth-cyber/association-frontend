import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // backend lo ledu – empty

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD DASHBOARD DATA
     (BACKEND CONFIRMED ROUTES)
  ========================= */
  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard"),     // ✅ EXISTS
      api.get("/api/announcements"),   // ✅ EXISTS
    ])
      .then(([dashRes, annRes]) => {
        setDashboard(dashRes.data);
        setAnnouncements(annRes.data.slice(0, 5));
        setSuggestions([]); // ❌ suggestions route backend lo ledu
      })
      .catch((err) => {
        console.error("Dashboard error 👉", err);
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
  if (error || !dashboard) {
    return (
      <>
        <Navbar />
        <div style={{ ...page, color: "red" }}>{error}</div>
      </>
    );
  }

  const receipts = Array.isArray(dashboard.recentContributions)
    ? dashboard.recentContributions
    : [];

  return (
    <>
      <Navbar />

      <div style={page}>
        <h1 style={pageTitle}>Admin Dashboard</h1>

        {/* ===== STATS ===== */}
        <div style={cardsGrid}>
          <StatCard title="Members" value={dashboard.totalMembers} />
          <StatCard title="Approved Receipts" value={dashboard.approvedReceipts} />
          <StatCard
            title="Total Collection"
            value={`₹${Number(dashboard.totalCollection).toLocaleString("en-IN")}`}
          />
          <StatCard title="Cancelled Receipts" value={dashboard.cancelledReceipts} />
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

        {/* ===== SUGGESTIONS (TEMP – BACKEND NOT AVAILABLE) ===== */}
        <div style={card}>
          <h3>💡 Latest Suggestions</h3>
          <p>No suggestions</p>
        </div>

        {/* ===== RECENT RECEIPTS ===== */}
        <div style={tableCard}>
          <h3>Recent Receipts</h3>
          {receipts.length === 0 ? (
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
                {receipts.map((r, i) => (
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
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginBottom: 25,
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
  border: "none",
};

const secondaryBtn = {
  background: "#e2e8f0",
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const auditBtn = {
  background: "#0f172a",
  color: "#fff",
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const tableCard = { background: "#fff", padding: 20, borderRadius: 12 };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { padding: 10, borderBottom: "1px solid #e2e8f0" };
const td = { padding: 10, borderBottom: "1px solid #f1f5f9" };
