import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function PresidentDashboard() {
  const [pendingContributions, setPendingContributions] = useState([]);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [contribRes, expenseRes] = await Promise.all([
        api.get("/contributions?status=PENDING"),
        api.get("/expenses?status=PENDING"),
      ]);

      setPendingContributions(contribRes.data);
      setPendingExpenses(expenseRes.data);
    } catch (err) {
      alert("Failed to load president dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     CONTRIBUTION ACTIONS
  ========================= */
  const approveContribution = async (id) => {
    if (!window.confirm("Approve this contribution?")) return;
    await api.put(`/contributions/${id}/approve`);
    loadData();
  };

  const rejectContribution = async (id) => {
    if (!window.confirm("Reject this contribution?")) return;
    await api.put(`/contributions/${id}/reject`);
    loadData();
  };

  /* =========================
     EXPENSE ACTIONS
  ========================= */
  const approveExpense = async (id) => {
    if (!window.confirm("Approve this expense?")) return;
    await api.put(`/expenses/${id}/approve`);
    loadData();
  };

  const cancelExpense = async (id) => {
    const reason = window.prompt("Reason for cancellation?");
    if (!reason) return;
    await api.put(`/expenses/${id}/cancel`, { reason });
    loadData();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>President Dashboard</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* =========================
                PENDING CONTRIBUTIONS
            ========================= */}
            <h3>Pending Contributions</h3>

            {pendingContributions.length === 0 ? (
              <p>No pending contributions</p>
            ) : (
              <table border="1" cellPadding="8" width="100%">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Fund</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingContributions.map((p) => (
                    <tr key={p.id}>
                      <td>{p.member_name}</td>
                      <td>{p.fund_name}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.payment_mode}</td>
                      <td>{p.reference_no || "-"}</td>
                      <td>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => approveContribution(p.id)}
                          style={{ marginRight: 8 }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectContribution(p.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* =========================
                PENDING EXPENSES
            ========================= */}
            <h3 style={{ marginTop: 40 }}>Pending Expenses</h3>

            {pendingExpenses.length === 0 ? (
              <p>No pending expenses</p>
            ) : (
              <table border="1" cellPadding="8" width="100%">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Fund</th>
                    <th>Amount</th>
                    <th>Requested By</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingExpenses.map((e) => (
                    <tr key={e.id}>
                      <td>{e.title}</td>
                      <td>{e.fund_name}</td>
                      <td>₹{e.amount}</td>
                      <td>{e.requested_by_name}</td>
                      <td>
                        {new Date(e.expense_date).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => approveExpense(e.id)}
                          style={{ marginRight: 8 }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => cancelExpense(e.id)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
}
