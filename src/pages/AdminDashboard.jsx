import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => {
        console.log("DASHBOARD RESPONSE 👉", res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Admin dashboard error:", err);
        setError("Access denied or server error");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={page}>
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }

  /* ===== ERROR ===== */
  if (error || !data) {
    return (
      <>
        <Navbar />
        <div style={page}>
          <p style={{ color: "red" }}>
            {error || "Failed to load dashboard"}
          </p>
        </div>
      </>
    );
  }

  /* ===== SAFE DATA ===== */
  const recentReceipts = Array.isArray(data.recentContributions)
    ? data.recentContributions
    : [];

  return (
    <>
      <Navbar />

      <div style={page}>
        <h1 style={pageTitle}>Admin Dashboard</h1>

        {/* ===== STATS ===== */}
        <div style={cardsGrid}>
          <StatCard title="Members" value={data.totalMembers ?? 0} />
          <StatCard title="Approved Receipts" value={data.approvedReceipts ?? 0} />
          <StatCard
            title="Total Collection"
            value={`₹${Number(data.totalCollection ?? 0).toLocaleString("en-IN")}`}
          />
          <StatCard title="Cancelled Receipts" value={data.cancelledReceipts ?? 0} />
        </div>

        {/* ===== ACTION BUTTONS ===== */}
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

        {/* ===== RECENT RECEIPTS ===== */}
        <div style={tableCard}>
          <h3 style={sectionTitle}>Recent Receipts</h3>

          {recentReceipts.length === 0 ? (
            <p>No receipts found</p>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Receipt No</th>
                  <th style={th}>Member</th>
                  <th style={th}>Fund</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReceipts.map((r, index) => (
                  <tr key={r.receipt_no ?? index}>
                    <td style={td}>{r.receipt_no || "-"}</td>
                    <td style={td}>{r.member_name || "-"}</td>
                    <td style={td}>{r.fund_name || "-"}</td>
                    <td style={td}>
                      ₹{Number(r.amount ?? 0).toLocaleString("en-IN")}
                    </td>
                    <td style={td}>
                      {r.receipt_date
                        ? new Date(r.receipt_date).toLocaleDateString()
                        : "-"}
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
  padding: "30px 40px",
  background: "#f1f5f9",
  minHeight: "100vh",
  fontFamily: "Inter, Segoe UI, sans-serif",
};

const pageTitle = {
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 25,
  color: "#0f172a",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginBottom: 25,
};

const card = {
  background: "#ffffff",
  padding: "22px 24px",
  borderRadius: 14,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const cardTitle = {
  fontSize: 14,
  color: "#64748b",
  fontWeight: 600,
};

const cardValue = {
  fontSize: 28,
  fontWeight: 700,
  color: "#0f172a",
};

const actions = {
  display: "flex",
  gap: 12,
  marginBottom: 30,
};

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#e2e8f0",
  color: "#0f172a",
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const auditBtn = {
  background: "#0f172a",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const tableCard = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const sectionTitle = {
  marginBottom: 12,
  fontSize: 18,
  fontWeight: 600,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px 10px",
  fontSize: 13,
  color: "#64748b",
  borderBottom: "1px solid #e2e8f0",
};

const td = {
  padding: "12px 10px",
  fontSize: 14,
  borderBottom: "1px solid #f1f5f9",
};
