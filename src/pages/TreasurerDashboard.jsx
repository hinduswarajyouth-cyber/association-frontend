import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD PENDING CONTRIBUTIONS
  ========================= */
  const loadPending = async () => {
    try {
      setLoading(true);
      const res = await api.get("/treasurer/pending");
      setPending(res.data.pending || []);
      setError("");
    } catch (err) {
      console.error("Pending load error 👉", err);
      setError("Failed to load pending contributions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  /* =========================
     APPROVE CONTRIBUTION
  ========================= */
  const approve = async (id) => {
    if (!window.confirm("Approve this contribution?")) return;

    try {
      await api.patch(`/treasurer/approve/${id}`);
      alert("Contribution approved successfully");
      loadPending();
    } catch (err) {
      console.error("Approve error 👉", err);
      alert(err.response?.data?.error || "Approve failed");
    }
  };

  /* =========================
     REJECT CONTRIBUTION
  ========================= */
  const reject = async (id) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    try {
      await api.patch(`/treasurer/reject/${id}`, { reason });
      alert("Contribution rejected");
      loadPending();
    } catch (err) {
      console.error("Reject error 👉", err);
      alert(err.response?.data?.error || "Reject failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2 style={title}>Treasurer – Pending Contributions</h2>

        {/* ===== LOADING ===== */}
        {loading && <p>Loading...</p>}

        {/* ===== ERROR ===== */}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {/* ===== EMPTY ===== */}
        {!loading && !error && pending.length === 0 && (
          <p>No pending contributions 🎉</p>
        )}

        {/* ===== TABLE ===== */}
        {!loading && pending.length > 0 && (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Member</th>
                <th style={th}>Fund</th>
                <th style={th}>Amount</th>
                <th style={th}>Payment</th>
                <th style={th}>Reference</th>
                <th style={th}>Date</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id}>
                  <td style={td}>{p.member_name}</td>
                  <td style={td}>{p.fund_name}</td>
                  <td style={td}>₹{Number(p.amount).toLocaleString("en-IN")}</td>
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
const page = {
  padding: 30,
  background: "#f8fafc",
  minHeight: "100vh",
};

const title = {
  marginBottom: 20,
};

const errorStyle = {
  color: "red",
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
