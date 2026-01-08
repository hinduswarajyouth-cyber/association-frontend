import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <h2>📉 Expenses</h2>

        {loading && <p>Loading...</p>}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {!loading && expenses.length === 0 && (
          <p>No expenses found</p>
        )}

        {!loading && expenses.length > 0 && (
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
                  <td>{e.fund_id}</td>
                  <td>₹{e.amount}</td>
                  <td>
                    {new Date(e.expense_date).toLocaleDateString()}
                  </td>
                  <td>
                    <b
                      style={{
                        color:
                          e.status === "APPROVED"
                            ? "green"
                            : e.status === "CANCELLED"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {e.status}
                    </b>
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
                      "-"
                    )}
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

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const errorStyle = { color: "red" };

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};

const cancelBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};
