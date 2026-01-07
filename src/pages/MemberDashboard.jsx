import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";

export default function MemberDashboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/api/dashboard/member").then((res) => {
      setRows(res.data.contributions || []);
    });
  }, []);

  return (
    <>
      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <div style={container}>
        <DashboardHeader />

        <h3 style={{ marginTop: 20 }}>My Contributions</h3>

        {rows.length === 0 ? (
          <p>No contributions yet</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.receipt_no}>
                  <td>{r.receipt_no}</td>
                  <td>₹{r.amount}</td>
                  <td>{r.status}</td>
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

const container = {
  padding: 30,
  maxWidth: 1100,
  margin: "0 auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 15,
};

