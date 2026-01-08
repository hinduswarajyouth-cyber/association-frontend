import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD EXPENSES
  ========================= */
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      setExpenses(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  /* =========================
     APPROVE
  ========================= */
  const approve = async (id) => {
    if (!window.confirm("Approve this expense?")) return;

    try {
      await api.put(`/expenses/${id}/approve`);
      alert("✅ Expense approved");
      loadExpenses();
    } catch (err) {
      alert(err.response?.data?.error || "Approve failed");
    }
  };

  /* =========================
     CANCEL
  ========================= */
  const cancel = async (id) => {
    const reason = prompt("Enter cancel reason");
    if (!reason) return;

    try {
      await api.put(`/expenses/${id}/cancel`, { reason });
      alert("❌ Expense cancelled");
      loadExpenses();
    } catch (err) {
      alert(err.response?.data?.error || "Cancel failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2 style={title}>📉 Expenses</h2>

        {/* LOADING */}
        {loading && <p>Loading expenses…</p>}

        {/* ERROR */}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {/* EMPTY */}
        {!loading && !error && expenses.length === 0 && (
          <p>No expenses found</p>
        )}

        {/* TABLE */}
        {!loading && expenses.length > 0 && (
          <div style={card}>
            <table style={table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Fund</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Requested By</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td>

                    <td>{e.fund_name || `Fund #${e.fund_id}`}</td>

                    <td>
                      ₹{Number(e.amount).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {new Date(e.expense_date).toLocaleDateString()}
                    </td>

                    <td>
                      <span style={statusBadge(e.status)}>
                        {e.status}
                      </span>
                    </td>

                    <td>{e.requested_by_name}</td>

                    <td>
                      {e.status === "PENDING" ? (
                        <>
                          <button
                            style={approveBtn}
                            onClick={() => approve(e.id)}
                          >
                            Approve
                          </button>{" "}
                          <button
                            style={cancelBtn}
                            onClick={() => cancel(e.id)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "#64748b" }}>—</span>
                      )}
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
const page = {
  padding: 30,
  background: "#f1f5f9",
  minHeight: "100vh",
};

const title = {
  marginBottom: 20,
};

const card = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const errorStyle = {
  color: "red",
};

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const cancelBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

/* =========================
   STATUS BADGE
========================= */
const statusBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  color: "#fff",
  background:
    status === "APPROVED"
      ? "#16a34a"
      : status === "CANCELLED"
      ? "#dc2626"
      : "#f59e0b",
});
