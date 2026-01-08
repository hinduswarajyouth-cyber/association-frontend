import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   ROLE FROM LOCAL STORAGE
========================= */
const ROLE = JSON.parse(localStorage.getItem("user"))?.role || "MEMBER";

const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT", "TREASURER"];

export default function Contributions() {
  const [list, setList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  /* FORM */
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    loadContributions();
    loadStats();
    // eslint-disable-next-line
  }, []);

  const loadContributions = async () => {
    try {
      const url = ADMIN_ROLES.includes(ROLE)
        ? "/api/contributions/all"
        : "/api/contributions/my";

      const res = await api.get(url);
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("LOAD CONTRIBUTIONS ERROR 👉", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/api/contributions/dashboard");
      setStats(res.data);
    } catch {
      setStats(null);
    }
  };

  /* =========================
     SUBMIT CASH
  ========================= */
  const submitCash = async () => {
    if (!amount || amount <= 0) return alert("Enter valid amount");

    await api.post("/api/contributions/submit", {
      amount,
      note,
    });

    setAmount("");
    setNote("");
    loadContributions();
    loadStats();
  };

  /* =========================
     APPROVE (ADMIN)
  ========================= */
  const approve = async (id) => {
    if (!window.confirm("Approve contribution?")) return;

    await api.put(`/api/contributions/approve/${id}`);
    loadContributions();
    loadStats();
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2>💰 Contributions</h2>

        {/* ================= DASHBOARD ================= */}
        {stats && (
          <div style={dashboardRow}>
            <Stat label="Total Contributions" value={stats.total_count} />
            <Stat label="Total Amount" value={`₹${stats.total_amount}`} />
            {stats.pending !== undefined && (
              <Stat label="Pending" value={stats.pending} />
            )}
            {stats.approved !== undefined && (
              <Stat label="Approved" value={stats.approved} />
            )}
          </div>
        )}

        {/* ================= SUBMIT ================= */}
        <div style={card}>
          <h3>Contribute</h3>

          <input
            style={input}
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            style={input}
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button style={btnPrimary} onClick={submitCash}>
            Submit Cash Contribution
          </button>
        </div>

        {/* ================= LIST ================= */}
        <h3>Contribution History</h3>

        {loading && <p>Loading...</p>}
        {!loading && list.length === 0 && <p>No contributions found</p>}

        {list.map((c) => (
          <div key={c.id} style={card}>
            <div style={row}>
              <strong>₹{c.amount}</strong>
              <Status status={c.payment_status} />
            </div>

            {c.member_name && (
              <div style={muted}>Member: {c.member_name}</div>
            )}

            <div style={muted}>
              {c.payment_method} •{" "}
              {new Date(c.created_at).toLocaleString()}
            </div>

            {c.payment_note && (
              <div style={noteBox}>{c.payment_note}</div>
            )}

            {/* ADMIN ACTION */}
            {ADMIN_ROLES.includes(ROLE) &&
              c.payment_status === "PENDING" && (
                <button style={btnApprove} onClick={() => approve(c.id)}>
                  Approve
                </button>
              )}
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */
function Stat({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <strong style={statValue}>{value}</strong>
    </div>
  );
}

function Status({ status }) {
  const color =
    status === "APPROVED"
      ? "#16a34a"
      : status === "PENDING"
      ? "#f97316"
      : "#64748b";

  return (
    <span style={{ ...badge, background: color }}>
      {status}
    </span>
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

const dashboardRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 16,
  marginBottom: 20,
};

const statCard = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  textAlign: "center",
};

const statLabel = { fontSize: 13, color: "#64748b" };
const statValue = { fontSize: 22 };

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const muted = { fontSize: 13, color: "#64748b" };

const noteBox = {
  background: "#f8fafc",
  padding: 8,
  borderRadius: 8,
  marginTop: 6,
  fontSize: 13,
};

const input = {
  width: 260,
  padding: 8,
  marginBottom: 10,
  marginRight: 10,
};

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnApprove = {
  marginTop: 8,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
};

const badge = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
};
