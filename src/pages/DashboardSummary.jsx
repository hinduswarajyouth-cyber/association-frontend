import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function DashboardSummary() {
  const [summary, setSummary] = useState({
    total_members: 0,
    approved_receipts: 0,
    total_collection: 0,
    cancelled_receipts: 0,
  });
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  const loadSummary = async () => {
    try {
      setLoading(true);

      const [summaryRes, fundsRes] = await Promise.all([
        api.get("/dashboard/admin-summary"),
        api.get("/dashboard/funds"),
      ]);

      setSummary(summaryRes.data);
      setFunds(fundsRes.data);
      setError("");
    } catch (err) {
      console.error("Dashboard summary error 👉", err);
      setError("Failed to load dashboard summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: 30, background: "#f1f5f9", minHeight: "100vh" }}>
        <h2>Dashboard Summary</h2>

        {/* ===== LOADING ===== */}
        {loading && <p>Loading summary...</p>}

        {/* ===== ERROR ===== */}
        {!loading && error && <p style={{ color: "red" }}>{error}</p>}

        {/* ===== CONTENT ===== */}
        {!loading && !error && (
          <>
            {/* ===== SUMMARY CARDS ===== */}
            <div style={cardGrid}>
              <SummaryCard
                title="Total Members"
                value={summary.total_members}
                color="#2563eb"
              />
              <SummaryCard
                title="Approved Receipts"
                value={summary.approved_receipts}
                color="#16a34a"
              />
              <SummaryCard
                title="Total Collection"
                value={`₹${Number(summary.total_collection).toLocaleString("en-IN")}`}
                color="#0f172a"
              />
              <SummaryCard
                title="Cancelled Receipts"
                value={summary.cancelled_receipts}
                color="#dc2626"
              />
            </div>

            {/* ===== FUND BALANCES ===== */}
            <h3 style={{ marginTop: 40 }}>Fund-wise Balance</h3>

            {funds.length === 0 ? (
              <p>No funds available</p>
            ) : (
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Fund</th>
                    <th style={th}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map((f) => (
                    <tr key={f.id}>
                      <td style={td}>{f.fund_name}</td>
                      <td style={td}>
                        ₹{Number(f.balance).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
}

/* =========================
   REUSABLE CARD
========================= */
function SummaryCard({ title, value, color }) {
  return (
    <div style={{ ...card, borderLeft: `6px solid ${color}` }}>
      <div style={cardTitle}>{title}</div>
      <div style={{ ...cardValue, color }}>{value}</div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
};

const cardTitle = {
  fontSize: 14,
  color: "#64748b",
  marginBottom: 8,
};

const cardValue = {
  fontSize: 28,
  fontWeight: "bold",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  marginTop: 10,
};

const th = {
  padding: 10,
  borderBottom: "2px solid #e5e7eb",
  background: "#f1f5f9",
};

const td = {
  padding: 10,
  borderBottom: "1px solid #e5e7eb",
};
