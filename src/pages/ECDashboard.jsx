import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";

export default function ECDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD DASHBOARD SUMMARY
  ========================= */
  useEffect(() => {
    api
      .get("/api/dashboard/admin-summary")
      .then((res) => {
        setSummary(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("EC Dashboard error 👉", err);
        setError("Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <div style={page}>
        {/* HEADER (shows user name automatically) */}
        <DashboardHeader subtitle="EC Member Dashboard (Read Only)" />

        {/* LOADING */}
        {loading && <p>Loading dashboard...</p>}

        {/* ERROR */}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {/* DATA */}
        {!loading && summary && (
          <>
            <p style={infoText}>
              📊 Association Overview (Read-only access)
            </p>

            <div style={cardsGrid}>
              <StatCard
                title="Total Members"
                value={summary.total_members}
              />
              <StatCard
                title="Approved Receipts"
                value={summary.approved_receipts}
              />
              <StatCard
                title="Total Collection"
                value={`₹${Number(summary.total_collection).toLocaleString(
                  "en-IN"
                )}`}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* =========================
   STAT CARD
========================= */
function StatCard({ title, value }) {
  return (
    <div style={card}>
      <div style={cardTitle}>{title}</div>
      <div style={cardValue}>{value}</div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const page = {
  padding: 30,
  background: "#f1f5f9",
  minHeight: "100vh",
};

const infoText = {
  margin: "10px 0 25px",
  color: "#475569",
};

const errorStyle = {
  color: "red",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const cardTitle = {
  fontSize: 14,
  color: "#64748b",
  marginBottom: 8,
};

const cardValue = {
  fontSize: 28,
  fontWeight: 700,
};
