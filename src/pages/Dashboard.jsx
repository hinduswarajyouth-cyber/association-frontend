import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   STAT CARD
========================= */
function StatCard({ title, value }) {
  return (
    <div style={card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default function Dashboard() {
  const [contributions, setContributions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isMobile = window.innerWidth < 768;

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  const loadDashboard = async () => {
    try {
      const [dashboardRes, announcementsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/api/announcements"),
      ]);

      setContributions(dashboardRes.data.recentContributions || []);
      setAnnouncements(announcementsRes.data || []);
    } catch (err) {
      console.error("Dashboard load error 👉", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =========================
     MARK ANNOUNCEMENT SEEN
  ========================= */
  const markSeen = async (id) => {
    try {
      await api.post(`/api/announcements/${id}/seen`);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, seen: true } : a))
      );
    } catch (err) {
      console.error("Mark seen failed 👉", err);
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading...</p>;
  if (error) return <p style={{ padding: 30, color: "red" }}>{error}</p>;

  /* =========================
     CALCULATIONS
  ========================= */
  const approved = contributions.filter((c) => c.status === "APPROVED");
  const totalAmount = approved.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2>Welcome 👋</h2>

        {/* =========================
           📌 PINNED ANNOUNCEMENT
        ========================= */}
        {announcements
          .filter((a) => a.priority === "PINNED")
          .slice(0, 1)
          .map((a) => (
            <div key={a.id} style={pinned}>
              📌 <b>{a.title}</b> — {a.message}
            </div>
          ))}

        {/* =========================
           📊 STATS
        ========================= */}
        <div style={statsRow}>
          <StatCard title="Approved Contributions" value={approved.length} />
          <StatCard title="Total Amount" value={`₹${totalAmount}`} />
        </div>

        {/* =========================
           📢 ANNOUNCEMENTS
        ========================= */}
        <h3 style={{ marginTop: 40 }}>📢 Announcements</h3>

        {announcements.length === 0 ? (
          <p>No announcements</p>
        ) : (
          <div style={cardGrid}>
            {announcements.slice(0, 5).map((a) => (
              <div
                key={a.id}
                onClick={() => !a.seen && markSeen(a.id)}
                style={{
                  ...cardItem,
                  cursor: "pointer",
                  opacity: a.seen ? 0.7 : 1,
                  borderLeft:
                    a.priority === "PINNED"
                      ? "5px solid #dc2626"
                      : "5px solid #2563eb",
                }}
              >
                <h4>
                  {!a.seen && <span style={newBadge}>NEW</span>}
                  {a.priority === "PINNED" && (
                    <span style={pinBadge}>PINNED</span>
                  )}
                  {a.title}
                </h4>
                <p style={{ fontSize: 14 }}>{a.message}</p>
                <small>
                  📅 {new Date(a.created_at).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}

        {/* =========================
           📋 CONTRIBUTIONS
        ========================= */}
        <h3 style={{ marginTop: 40 }}>My Contributions</h3>

        {contributions.length === 0 ? (
          <p>No contributions yet</p>
        ) : isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {contributions.map((c, i) => (
              <div key={i} style={mobileCard}>
                <div><b>Fund:</b> {c.fund_name}</div>
                <div><b>Amount:</b> ₹{c.amount}</div>
                <div>
                  <b>Status:</b>
                  <span style={badge(c.status)}>{c.status}</span>
                </div>
                <div><b>Date:</b> {c.receipt_date?.slice(0, 10)}</div>
              </div>
            ))}
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Fund</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c, i) => (
                <tr key={i}>
                  <td>{c.fund_name}</td>
                  <td>₹{c.amount}</td>
                  <td>
                    <span style={badge(c.status)}>{c.status}</span>
                  </td>
                  <td>{c.receipt_date?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */
const container = { maxWidth: 1100, margin: "auto", padding: 30 };
const statsRow = { display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" };
const card = { flex: 1, padding: 20, borderRadius: 10, background: "#f5f7fb" };

const pinned = {
  background: "#fff3cd",
  padding: 12,
  borderRadius: 6,
  margin: "20px 0",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 15,
  marginTop: 15,
};

const cardItem = {
  background: "#fff",
  padding: 15,
  borderRadius: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const newBadge = {
  background: "#2563eb",
  color: "#fff",
  fontSize: 10,
  padding: "2px 6px",
  borderRadius: 6,
  marginRight: 6,
};

const pinBadge = {
  background: "#dc2626",
  color: "#fff",
  fontSize: 10,
  padding: "2px 6px",
  borderRadius: 6,
  marginRight: 6,
};

const tableStyle = { width: "100%", marginTop: 15, borderCollapse: "collapse" };

const mobileCard = {
  background: "#fff",
  padding: 14,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const badge = (status) => ({
  marginLeft: 6,
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
  background:
    status === "APPROVED"
      ? "#16a34a"
      : status === "PENDING"
      ? "#f59e0b"
      : "#dc2626",
});
