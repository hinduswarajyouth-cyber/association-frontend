import { useEffect, useState } from "react";
import api from "../api/api";

export default function PublicDonation() {
  const [funds, setFunds] = useState([]);
  const [form, setForm] = useState({
    donor_name: "",
    donor_phone: "",
    fund_id: "",
    amount: "",
    payment_mode: "CASH",
    reference_no: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/public/funds").then((res) => setFunds(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/public/donate", form);
      setMsg("🙏 Thank you! Donation submitted");
      setForm({
        donor_name: "",
        donor_phone: "",
        fund_id: "",
        amount: "",
        payment_mode: "CASH",
        reference_no: "",
      });
    } catch (err) {
      alert("Donation failed");
    }
  };

  return (
    <div style={page}>
      <h1>🙏 Donate to Our Association</h1>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={submit} style={card}>
        <input
          placeholder="Your Name (optional)"
          value={form.donor_name}
          onChange={(e) =>
            setForm({ ...form, donor_name: e.target.value })
          }
        />

        <input
          placeholder="Phone (optional)"
          value={form.donor_phone}
          onChange={(e) =>
            setForm({ ...form, donor_phone: e.target.value })
          }
        />

        <select
          required
          value={form.fund_id}
          onChange={(e) =>
            setForm({ ...form, fund_id: e.target.value })
          }
        >
          <option value="">Select Fund</option>
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.fund_name}
            </option>
          ))}
        </select>

        <input
          required
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <select
          value={form.payment_mode}
          onChange={(e) =>
            setForm({ ...form, payment_mode: e.target.value })
          }
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="BANK">Bank Transfer</option>
        </select>

        {form.payment_mode !== "CASH" && (
          <input
            placeholder="Transaction Reference"
            value={form.reference_no}
            onChange={(e) =>
              setForm({ ...form, reference_no: e.target.value })
            }
          />
        )}

        <button type="submit">Donate</button>
      </form>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#f1f5f9",
  padding: 40,
};

const card = {
  maxWidth: 400,
  margin: "auto",
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
