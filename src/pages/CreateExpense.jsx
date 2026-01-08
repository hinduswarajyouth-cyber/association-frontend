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

  /* =========================
     LOAD ACTIVE FUNDS
  ========================= */
  useEffect(() => {
    const loadFunds = async () => {
      try {
        const res = await api.get("/funds/list");
        setFunds(res.data?.funds || []);
      } catch (err) {
        alert("Failed to load funds");
      } finally {
        setLoading(false);
      }
    };

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
          <h2 style={title}>💸 Create Expense</h2>
          <p style={subtitle}>
            Expense will be sent for approval before deduction
          </p>

          {loading ? (
            <p>Loading funds…</p>
          ) : (
            <form onSubmit={submitExpense}>
              {/* TITLE */}
              <Field label="Expense Title *">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Example: Banner Printing"
                  required
                />
              </Field>

              {/* CATEGORY */}
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Travel / Event / Printing"
                />
              </Field>

              {/* FUND */}
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

              {/* AMOUNT */}
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

              {/* DATE */}
              <Field label="Expense Date *">
                <input
                  type="date"
                  value={form.expense_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expense_date: e.target.value,
                    })
                  }
                  required
                />
              </Field>

              {/* DESCRIPTION */}
              <Field label="Description">
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Optional notes"
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                style={submitBtn}
              >
                {submitting ? "Submitting…" : "Submit Expense"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

/* =========================
   SMALL FIELD COMPONENT
========================= */
function Field({ label, children }) {
  return (
    <div style={field}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
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

const card = {
  maxWidth: 620,
  background: "#fff",
  padding: 24,
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
};

const title = { marginBottom: 6 };
const subtitle = { color: "#64748b", marginBottom: 20 };

const field = {
  marginBottom: 14,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
};

const submitBtn = {
  width: "100%",
  padding: "12px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};
