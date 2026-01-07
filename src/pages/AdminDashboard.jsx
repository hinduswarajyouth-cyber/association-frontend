import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ===== STATES ===== */
  const [summary, setSummary] = useState(null);
  const [funds, setFunds] = useState([]);
  const [recentReceipts, setRecentReceipts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [cashflow, setCashflow] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    Promise.all([
      api.get("/dashboard/admin-summary"),
      api.get("/dashboard/recent-contributions"),
      api.get("/dashboard/funds"),
      api.get("/api/announcements"),
      api.get(`/dashboard/cashflow?year=${year}&month=${month}`),
    ])
      .then(
        ([summaryRes, recentRes, fundsRes, annRes, cashRes]) => {
          setSummary(summaryRes.data);
          setRecentReceipts(recentRes.data);
          setFunds(fundsRes.data);
          setAnnouncements(annRes.data.slice(0, 5));

          setCashflow([
            {
              name: now.toLocaleString("default", { month: "short" }),
              credit: Number(cashRes.data.total_credit || 0),
              debit: Number(cashRes.data.total_debit || 0),
            },
          ]);
        }
      )
      .catch((err) => {
        console.error("Dashboard error 👉", err);
        setError("Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={page}>Loading dashboard...</div>
      </>
    );
  }

  /* ===== ERROR ===== */
  if (error || !summary) {
    return (
      <>
        <Navbar />
        <div style={{ ...page, color: "red" }}>{error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={page}>
        <h1 style={pageTitle}>Admin Dashboard</h1>

        {/* ===== STATS ===== */}
        <div style={cardsGrid}>
          <StatCard title="Members" value={summary.total_members} />
          <StatCard title="Approved Receipts" value={summary.approved_receipts} />
          <StatCard
            title="Total Collection"
            value={`₹${Number(summary.total_collection).toLocaleString("en-IN")}`}
          />
          <StatCard title="Cancelled Receipts" value={summary.cancelled_receipts} />
        </div>

        {/* ===== ACTIONS ===== */}
        <div style={actions}>
          <button style={primaryBtn} onClick={() => navigate("/members")}>
            View Members
          </button>
          <button style={secondaryBtn} onClick={() => navigate("/expenses")}>
            Expenses
          </button>
          <button style={auditBtn} onClick={() => navigate("/audit-logs")}>
            Audit Logs
          </button>
        </div>

        {/* ===== FUND BALANCES ===== */}
        <div style={card}>
          <h3>💰 Fund Balances</h3>
          <ul>
            {funds.map((f) => (
              <li key={f.id}>
                <b>{f.fund_name}</b> — ₹
                {Number(f.balance).toLocaleString("en-IN")}
              </li>
            ))}
          </ul>
        </div>

        {/* ===== CHARTS ===== */}
        <div style={chartsGrid}>
          {/* Monthly Cashflow */}
          <div style={chartCard}>
            <h3>📊 Monthly Cashflow</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashflow}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="credit" fill="#16a34a" name="Collection" />
                <Bar dataKey="debit" fill="#dc2626" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fund-wise Balance */}
          <div style={chartCard}>
            <h3>💼 Fund-wise Balance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={funds}
                  dataKey="balance"
                  nameKey="fund_name"
                  outerRadius={120}
                  label
                >
                  {funds.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== ANNOUNCEMENTS ===== */}
        <div style={card}>
          <h3>📢 Latest Announcements</h3>
          <ul>
            {announcements.map((a) => (
              <li key={a.id}>
                <b>{a.title}</b> — {a.message}
              </li>
            ))}
          </ul>
        </div>

        {/* ===== RECENT RECEIPTS ===== */}
        <div style={tableCard}>
          <h3>🧾 Recent Receipts</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Receipt No</th>
                <th style={th}>Member</th>
                <th style={th}>Amount</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentReceipts.map((r, i) => (
                <tr key={i}>
                  <td style={td}>{r.receipt_no}</td>
                  <td style={td}>{r.member_name}</td>
                  <td style={td}>₹{r.amount}</td>
                  <td style={td}>
                    {new Date(r.receipt_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

/* ===== CONSTANTS ===== */
const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

/* ===== STYLES ===== */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const pageTitle = { fontSize: 26, fontWeight: 700 };

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginBottom: 25,
};

const chartsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  marginBottom: 30,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};

const chartCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
};

const cardTitle = { fontSize: 14, color: "#64748b" };
const cardValue = { fontSize: 28, fontWeight: 700 };

const actions = { display: "flex", gap: 12, marginBottom: 30 };

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const secondaryBtn = {
  background: "#e2e8f0",
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const auditBtn = {
  background: "#0f172a",
  color: "#fff",
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const tableCard = { background: "#fff", padding: 20, borderRadius: 12 };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { padding: 10, borderBottom: "1px solid #e2e8f0" };
const td = { padding: 10, borderBottom: "1px solid #f1f5f9" };
