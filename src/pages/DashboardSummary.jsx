import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function DashboardSummary() {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
  });
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  const loadSummary = async () => {
    try {
      const [summaryRes, fundsRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/funds"),
      ]);

      setSummary(summaryRes.data);
      setFunds(fundsRes.data);
    } catch (err) {
      alert("Failed to load dashboard summary");
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
      <div style={{ padding: 30 }}>
        <h2>Dashboard Summary</h2>

        {loading ? (
          <p>Loading summary...</p>
        ) : (
          <>
            {/* =========================
                SUMMARY CARDS
            ========================= */}
            <div style={cardGrid}>
              <SummaryCard
                title="Total Balance"
                value={`₹${summary.totalBalance}`}
                color="#16a34a"
              />
              <SummaryCard
                title="Total Income"
                value={`₹${summary.totalIncome}`}
                color="#2563eb"
              />
              <SummaryCard
                title="Total Expense"
                value={`₹${summary.totalExpense}`}
                color="#dc2626"
              />
            </div>

            {/* =========================
                FUND-WISE BALANCE
            ========================= */}
            <h3 style={{ marginTop: 40 }}>Fund-wise Balance</h3>

            {funds.length === 0 ? (
              <p>No funds available</p>
            ) : (
              <table border="1" cellPadding="8" width="100%">
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map((f) => (
                    <tr key={f.id}>
                      <td>{f.fund_name}</td>
                      <td>{f.fund_type}</td>
                      <td>{f.status}</td>
                      <td>₹{f.balance}</td>
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
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
