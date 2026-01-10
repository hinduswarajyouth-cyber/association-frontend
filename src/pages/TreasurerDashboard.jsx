import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerDashboard() {
  const [members, setMembers] = useState([]);
  const [publics, setPublics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("MEMBER");
  const [error, setError] = useState("");

  /* ===========================
      LOAD ALL DATA
  ============================ */
  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [mRes, pRes, sRes] = await Promise.all([
        api.get("/treasurer/pending-members"),
        api.get("/treasurer/pending-public"),
        api.get("/treasurer/summary"),
      ]);

      setMembers(mRes.data || []);
      setPublics(pRes.data || []);
      setSummary(sRes.data || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load treasurer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ===========================
      APPROVE
  ============================ */
  const approve = async (id) => {
    if (!window.confirm("Approve this donation?")) return;

    try {
      setLoading(true);

      if (tab === "MEMBER") {
        const r = await api.patch(`/treasurer/approve-member/${id}`);
        alert(`✅ Approved\nReceipt: ${r.data.receipt}`);
      } else {
        await api.patch(`/treasurer/approve-public/${id}`);
        alert("✅ Public donation approved");
      }

      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || "Approve failed");
    } finally {
      setLoading(false);
    }
  };

  const rows = tab === "MEMBER" ? members : publics;

  /* ===========================
      UI
  ============================ */
  return (
    <>
      <Navbar />

      <div style={page}>
        <h2 style={title}>💼 Treasurer Dashboard</h2>

        {/* ===== SUMMARY ===== */}
        {summary && (
          <div style={cardRow}>
            <div style={card}>
              <h4>Member Donations</h4>
              <p style={cardNum}>{summary.member_count}</p>
            </div>
            <div style={card}>
              <h4>Public Donations</h4>
              <p style={cardNum}>{summary.public_count}</p>
            </div>
            <div style={card}>
              <h4>Total Collection</h4>
              <p style={cardNum}>
                ₹{Number(summary.total_collection).toLocaleString("en-IN")}
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
        {loading && <p>Loading…</p>}
        {error && <p style={errorStyle}>{error}</p>}

        {!loading && rows.length === 0 && (
          <p>No pending {tab.toLowerCase()} donations 🎉</p>
        )}

        {/* ===== TABLE ===== */}
        {!loading && rows.length > 0 && (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Donor</th>
                <th style={th}>Amount</th>
                <th style={th}>Mode</th>
                <th style={th}>Reference</th>
                <th style={th}>Date</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id}>
                  <td style={td}>{d.member_name || d.name || "Public Donor"}</td>
                  <td style={td}>
                    ₹{Number(d.amount).toLocaleString("en-IN")}
                  </td>
                  <td style={td}>{d.payment_mode}</td>
                  <td style={td}>{d.reference_no || "-"}</td>
                  <td style={td}>
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    <button
                      style={approveBtn}
                      onClick={() => approve(d.id)}
                    >
                      Approve
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

/* ===========================
   STYLES
=========================== */
const page = { padding: 30, background: "#f8fafc", minHeight: "100vh" };
const title = { marginBottom: 20 };

const cardRow = { display: "flex", gap: 20, marginBottom: 25 };
const card = {
  flex: 1,
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};
const cardNum = { fontSize: 24, fontWeight: "bold" };

const tabs = { display: "flex", gap: 10, marginBottom: 20 };
const tabBtn = {
  padding: "8px 18px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  background: "#fff",
  cursor: "pointer",
};
const tabActive = { ...tabBtn, background: "#2563eb", color: "#fff" };

const table = { width: "100%", borderCollapse: "collapse", background: "#fff" };
const th = {
  padding: 10,
  background: "#f1f5f9",
  borderBottom: "2px solid #e5e7eb",
};
const td = {
  padding: 10,
  borderBottom: "1px solid #e5e7eb",
};

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const errorStyle = { color: "red" };
