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

  const isMobile = window.innerWidth < 768;

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

  if (loading) return <p style={{ padding: 30 }}>Loading...</p>;
  if (error) return <p style={{ padding: 30, color: "red" }}>{error}</p>;

  /* =========================
     📊 APPROVED ONLY
  ========================= */
  const approved = contributions.filter(
    (c) => c.status === "APPROVED"
  );

  const totalAmount = approved.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2>Welcome 👋</h2>

        {/* 📌 PINNED */}
        {announcements
          .filter((a) => a.priority === "PINNED")
          .slice(0, 1)
          .map((a) => (
            <div key={a.id} style={pinned}>
              📌 <b>{a.title}</b> — {a.message}
            </div>
          ))}

        {/* 📊 STATS */}
        <div style={statsRow}>
          <StatCard
            title="Approved Contributions"
            value={approved.length}
          />
          <StatCard
            title="Total Amount Contributed"
            value={`₹${totalAmount}`}
          />
        </div>

        {/* 📋 CONTRIBUTIONS */}
        <h3 style={{ marginTop: 40 }}>My Contributions</h3>

        {contributions.length === 0 ? (
          <p>No contributions yet</p>
        ) : isMobile ? (
          /* 📱 MOBILE CARDS */
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {contributions.map((c, i) => (
              <div key={i} style={mobileCard}>
                <div><b>Fund:</b> {c.fund_name}</div>
                <div><b>Amount:</b> ₹{c.amount}</div>
                <div>
                  <b>Status:</b>{" "}
                  <span style={badge(c.status)}>{c.status}</span>
                </div>
                <div><b>Date:</b> {c.receipt_date?.slice(0, 10)}</div>
              </div>
            ))}
          </div>
        ) : (
          /* 💻 DESKTOP TABLE */
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
  flexWrap: "wrap",
};

const card = {
  flex: 1,
  padding: 20,
  borderRadius: 10,
  background: "#f5f7fb",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const pinned = {
  background: "#fff3cd",
  padding: "12px 15px",
  borderRadius: 6,
  margin: "20px 0",
  border: "1px solid #ffe69c",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 15,
};

const mobileCard = {
  background: "#fff",
  padding: 14,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const badge = (status) => ({
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
  marginLeft: 6,
  background:
    status === "APPROVED"
      ? "#16a34a"
      : status === "PENDING"
      ? "#f59e0b"
      : "#dc2626",
});
