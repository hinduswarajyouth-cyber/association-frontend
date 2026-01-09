import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerExpenseCreate() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    expense_date: "",
    fund_id: "",
    description: "",
  });

  /* LOAD FUNDS */
  useEffect(() => {
    const loadFunds = async () => {
      try {
        const res = await api.get("/funds/list");
        setFunds(res.data?.funds || []);
      } catch {
        alert("Failed to load funds");
      } finally {
        setLoading(false);
      }
    };
    loadFunds();
  }, []);

  /* SUBMIT EXPENSE */
  const submitExpense = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.expense_date || !form.fund_id) {
      return alert("Please fill all required fields");
    }

    if (!window.confirm("Submit expense for approval?")) return;

    try {
      setSubmitting(true);

      await api.post("/expenses", {
        title: form.title,
        category: form.category || null,
        amount: Number(form.amount),
        expense_date: form.expense_date,
        fund_id: Number(form.fund_id),
        description: form.description || null,
      });

      alert("✅ Expense submitted successfully");

      setForm({
        title: "",
        category: "",
        amount: "",
        expense_date: "",
        fund_id: "",
        description: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={page}>
        <div style={card}>
          <h2>💸 Create Expense</h2>
          <p style={{ color: "#64748b" }}>
            Expense will be sent for approval before deduction
          </p>

          {loading ? (
            <p>Loading funds…</p>
          ) : (
            <form onSubmit={submitExpense}>
              <Field label="Expense Title *">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </Field>

              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </Field>

              <Field label="Fund *">
                <select
                  value={form.fund_id}
                  onChange={(e) =>
                    setForm({ ...form, fund_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Fund</option>
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.fund_name} — Balance ₹
                      {Number(f.balance).toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Amount (₹) *">
                <input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  required
                />
              </Field>

              <Field label="Expense Date *">
                <input
                  type="date"
                  value={form.expense_date}
                  onChange={(e) =>
                    setForm({ ...form, expense_date: e.target.value })
                  }
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Field>

              <button disabled={submitting} style={submitBtn}>
                {submitting ? "Submitting…" : "Submit Expense"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const card = {
  maxWidth: 620,
  background: "#fff",
  padding: 24,
  borderRadius: 14,
};
const submitBtn = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  border: "none",
};
