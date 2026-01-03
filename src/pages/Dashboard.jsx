import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   ✅ SIMPLE STAT CARD
========================= */
function StatCard({ title, value }) {
  return (
    <div style={card}>
      <h4 style={{ marginBottom: 10 }}>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default function Dashboard() {
  const [contributions, setContributions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     📥 LOAD DASHBOARD DATA
  ========================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [contriRes, annRes] = await Promise.all([
          api.get("/members/contributions"),
          api.get("/announcements"),
        ]);

        setContributions(contriRes.data.contributions || []);
        setAnnouncements(annRes.data || []);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ padding: 30, color: "red" }}>{error}</p>;
  }

  /* =========================
     📊 CALCULATIONS
  ========================= */
  const totalContributions = contributions.length;

  const totalAmount = contributions.reduce(
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
            <div
              key={a.id}
              style={{
                background: "#fff3cd",
                padding: "12px 15px",
                borderRadius: "6px",
                margin: "20px 0",
                border: "1px solid #ffe69c",
              }}
            >
              📌 <b>{a.title}</b> — {a.message}
            </div>
          ))}

        {/* =========================
           📊 STATS
        ========================= */}
        <div style={statsRow}>
          <StatCard
            title="Total Contributions"
            value={totalContributions}
          />
          <StatCard
            title="Total Amount Contributed"
            value={`₹${totalAmount}`}
          />
        </div>

        {/* =========================
           📰 LATEST ANNOUNCEMENTS
        ========================= */}
        {announcements.length > 0 && (
          <>
            <h3 style={{ marginTop: 35 }}>📢 Latest Announcements</h3>

            <div style={{ marginTop: 10 }}>
              {announcements.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: "8px 0",
                    fontWeight: a.seen ? "normal" : "bold",
                  }}
                >
                  {!a.seen && "🔵 "} {a.title}
                </div>
              ))}
            </div>
          </>
        )}

        {/* =========================
           📋 CONTRIBUTIONS TABLE
        ========================= */}
        <h3 style={{ marginTop: 40 }}>My Contributions</h3>

        {contributions.length === 0 ? (
          <p>No contributions yet</p>
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
                    <span style={badge(c.status)}>
                      {c.status}
                    </span>
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
   🎨 STYLES
========================= */

const container = {
  maxWidth: 1100,
  margin: "auto",
  padding: 30,
};

const statsRow = {
  display: "flex",
  gap: 20,
  marginTop: 20,
};

const card = {
  flex: 1,
  padding: 20,
  borderRadius: 10,
  background: "#f5f7fb",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 15,
};

const badge = (status) => ({
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
