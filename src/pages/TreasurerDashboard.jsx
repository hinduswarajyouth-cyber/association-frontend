import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerDashboard() {
  const [pending, setPending] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("MEMBER"); // MEMBER | PUBLIC

  /* =========================
     LOAD SUMMARY + PENDING
  ========================= */
  const loadAll = async () => {
    try {
      setLoading(true);

      const [pRes, sRes] = await Promise.all([
        api.get("/treasurer/pending"),
        api.get("/dashboard/treasurer-summary"),
      ]);

      setPending(pRes.data.data || []);

      const s = sRes.data.data || {};
      setSummary({
        pending_count: Number(s.pending_contributions || 0),
        approved_count: Number(s.approved_contributions || 0),
        total_collection: Number(s.total_collection || 0),
      });

      setError("");
    } catch (err) {
      console.error("Load error 👉", err);
      setError(err.response?.data?.error || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* =========================
     ACTIONS
  ========================= */
  const approve = async (id) => {
    if (!window.confirm("Approve this contribution?")) return;

    try {
      setLoading(true);
      const res = await api.patch(`/treasurer/approve/${id}`);
      alert(`✅ Approved\nReceipt No: ${res.data.receipt_no}`);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || "Approve failed");
    } finally {
      setLoading(false);
    }
  };

  const reject = async (id) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    try {
      setLoading(true);
      await api.patch(`/treasurer/reject/${id}`, { reason });
      alert("❌ Contribution rejected");
      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || "Reject failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER BY TAB
  ========================= */
  const filtered = pending.filter((p) => p.source === tab);

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2 style={title}>💼 Treasurer Dashboard</h2>

        {/* ===== SUMMARY ===== */}
        {summary && (
          <div style={cardRow}>
            <div style={card}>
              <h4>Pending</h4>
              <p style={cardNum}>{summary.pending_count}</p>
            </div>
            <div style={card}>
              <h4>Approved</h4>
              <p style={cardNum}>{summary.approved_count}</p>
            </div>
            <div style={card}>
              <h4>Total Collection</h4>
              <p style={cardNum}>
                ₹{summary.total_collection.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* ===== TABS ===== */}
        <div style={tabs}>
          <button
            style={tab === "MEMBER" ? tabActive : tabBtn}
            onClick={() => setTab("MEMBER")}
          >
            👤 Member Donations
          </button>

          <button
            style={tab === "PUBLIC" ? tabActive : tabBtn}
            onClick={() => setTab("PUBLIC")}
          >
            🌍 Public Donations
          </button>
        </div>

        {/* ===== STATUS ===== */}
        {loading && <p>Loading...</p>}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {!loading && filtered.length === 0 && (
          <p>No pending {tab.toLowerCase()} donations 🎉</p>
        )}

        {/* ===== TABLE ===== */}
        {!loading && filtered.length > 0 && (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Donor</th>
                <th style={th}>Fund</th>
                <th style={th}>Amount</th>
                <th style={th}>Payment</th>
                <th style={th}>Reference</th>
                <th style={th}>Date</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={td}>
                    {p.source === "PUBLIC"
                      ? p.donor_name || "Public Donor"
                      : p.member_name}
                  </td>
                  <td style={td}>{p.fund_name}</td>
                  <td style={td}>
                    ₹{Number(p.amount).toLocaleString("en-IN")}
                  </td>
                  <td style={td}>{p.payment_mode}</td>
                  <td style={td}>{p.reference_no || "-"}</td>
                  <td style={td}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    <button
                      style={approveBtn}
                      onClick={() => approve(p.id)}
                    >
                      Approve
                    </button>{" "}
                    <button
                      style={rejectBtn}
                      onClick={() => reject(p.id)}
                    >
                      Reject
                    </button>
                  </td>
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
const page = { padding: 30, background: "#f8fafc", minHeight: "100vh" };
const title = { marginBottom: 20 };
const errorStyle = { color: "red" };

const cardRow = { display: "flex", gap: 20, marginBottom: 25 };
const card = {
  flex: 1,
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};
const cardNum = { fontSize: 22, fontWeight: "bold" };

const tabs = { display: "flex", gap: 10, marginBottom: 20 };
const tabBtn = {
  padding: "8px 16px",
  border: "1px solid #cbd5f5",
  background: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};
const tabActive = {
  ...tabBtn,
  background: "#2563eb",
  color: "#fff",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
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

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
const rejectBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
