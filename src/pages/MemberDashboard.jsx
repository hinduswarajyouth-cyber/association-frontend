import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";

export default function MemberDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/member")
      .then((res) => {
        setRows(res.data.contributions || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     CALCULATIONS
  ========================= */
  const approved = rows.filter((r) => r.status === "APPROVED");
  const totalAmount = approved.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );

  return (
    <>
      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <div style={container}>
        <DashboardHeader />

        {/* ===== SUMMARY CARDS ===== */}
        <div style={cardsRow}>
          <div style={card}>
            <h4>Total Contributions</h4>
            <h2>{rows.length}</h2>
          </div>

          <div style={card}>
            <h4>Approved Amount</h4>
            <h2>₹{totalAmount}</h2>
          </div>
        </div>

        {/* ===== CONTRIBUTIONS TABLE ===== */}
        <h3 style={{ marginTop: 20 }}>My Contributions</h3>

        {loading ? (
          <p>Loading...</p>
        ) : rows.length === 0 ? (
          <p>No contributions yet</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Receipt</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Status</th>
                  <th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.receipt_no}>
                    <td style={td}>{r.receipt_no}</td>
                    <td style={td}>₹{r.amount}</td>
                    <td style={td}>
                      <span style={statusBadge(r.status)}>{r.status}</span>
                    </td>
                    <td style={td}>
                      {r.receipt_date?.slice(0, 10)}
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

/* =========================
   STYLES
========================= */

const container = {
  padding: 30,
  maxWidth: 1100,
  margin: "0 auto",
};

const cardsRow = {
  display: "flex",
  gap: 20,
  marginTop: 20,
  marginBottom: 30,
  flexWrap: "wrap",
};

const card = {
  flex: 1,
  background: "#f1f5f9",
  padding: 20,
  borderRadius: 12,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 15,
  background: "#fff",
};

const th = {
  padding: 12,
  borderBottom: "2px solid #e5e7eb",
  textAlign: "left",
  background: "#f8fafc",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};

const statusBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#fff",
  background:
    status === "APPROVED"
      ? "#16a34a"
      : status === "PENDING"
      ? "#f59e0b"
      : "#dc2626",
});
