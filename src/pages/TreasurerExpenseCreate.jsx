import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerExpenseCreate() {
  const [funds, setFunds] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    expense_date: "",
    fund_id: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     LOAD ACTIVE FUNDS
  ========================= */
  const loadFunds = async () => {
    try {
      const res = await api.get("/funds/list");
      setFunds(res.data.funds || []);
    } catch (err) {
      alert("Failed to load funds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  /* =========================
     SUBMIT EXPENSE
  ========================= */
  const submitExpense = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.amount ||
      !form.expense_date ||
      !form.fund_id
    ) {
      return alert("Please fill all required fields");
    }

    if (!window.confirm("Submit expense for approval?")) return;

    try {
      setSubmitting(true);

      await api.post("/expenses", {
        title: form.title,
        category: form.category,
        amount: Number(form.amount),
        expense_date: form.expense_date,
        fund_id: Number(form.fund_id),
        description: form.description,
      });

      alert("Expense submitted successfully");

      setForm({
        title: "",
        category: "",
        amount: "",
        expense_date: "",
        fund_id: "",
        description: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Failed to submit expense"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 30, maxWidth: 600 }}>
        <h2>Treasurer – Create Expense</h2>

        {loading ? (
          <p>Loading funds...</p>
        ) : (
          <form onSubmit={submitExpense}>
            <div style={field}>
              <label>Expense Title *</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div style={field}>
              <label>Category</label>
              <input
                placeholder="Travel / Event / Printing"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />
            </div>

            <div style={field}>
              <label>Fund *</label>
              <select
                value={form.fund_id}
                onChange={(e) =>
                  setForm({ ...form, fund_id: e.target.value })
                }
              >
                <option value="">-- Select Fund --</option>
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fund_name} (Balance: ₹{f.balance})
                  </option>
                ))}
              </select>
            </div>

            <div style={field}>
              <label>Amount (₹) *</label>
              <input
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />
            </div>

            <div style={field}>
              <label>Expense Date *</label>
              <input
                type="date"
                value={form.expense_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expense_date: e.target.value,
                  })
                }
              />
            </div>

            <div style={field}>
              <label>Description</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={submitBtn}
            >
              {submitting ? "Submitting..." : "Submit Expense"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

/* =========================
   SIMPLE STYLES
========================= */
const field = {
  marginBottom: 12,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const submitBtn = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
