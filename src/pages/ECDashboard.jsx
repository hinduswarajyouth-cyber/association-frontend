import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";

export default function ECDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard/admin-summary")
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <div style={container}>
        <DashboardHeader />

        <div style={headerRow}>
          <h3 style={title}>📊 Association Overview</h3>
          <span style={badge}>Read Only</span>
        </div>

        {loading ? (
          <div style={grid}>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div style={grid}>
            <Stat
              title="Total Members"
              value={summary.total_members}
            />
            <Stat
              title="Approved Receipts"
              value={summary.approved_receipts}
            />
            <Stat
              title="Total Collection"
              value={`₹${Number(summary.total_collection).toLocaleString("en-IN")}`}
            />
          </div>
        )}
      </div>
    </>
  );
}

/* =========================
   STAT CARD
========================= */
function Stat({ title, value }) {
  return (
    <div style={card}>
      <p style={cardTitle}>{title}</p>
      <h2 style={cardValue}>{value}</h2>
    </div>
  );
}

/* =========================
   SKELETON
========================= */
function SkeletonCard() {
  return (
    <div style={{ ...card, background: "#f8fafc" }}>
      <div style={skeletonTitle} />
      <div style={skeletonValue} />
    </div>
  );
}

/* =========================
   STYLES
========================= */

const container = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "32px 20px",
};

const headerRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 30,
};

const title = {
  fontSize: 20,
  fontWeight: 600,
};

const badge = {
  fontSize: 12,
  padding: "6px 10px",
  borderRadius: 20,
  background: "#f1f5f9",
  color: "#475569",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
  marginTop: 24,
};

const card = {
  background: "#ffffff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

card[":hover"] = {
  transform: "translateY(-4px)",
};

const cardTitle = {
  fontSize: 14,
  color: "#64748b",
  marginBottom: 8,
};

const cardValue = {
  fontSize: 32,
  fontWeight: 700,
  color: "#0f172a",
};

/* =========================
   SKELETON STYLES
========================= */
const skeletonTitle = {
  width: "60%",
  height: 14,
  background: "#e5e7eb",
  borderRadius: 6,
  marginBottom: 14,
};

const skeletonValue = {
  width: "40%",
  height: 32,
  background: "#e5e7eb",
  borderRadius: 8,
};
