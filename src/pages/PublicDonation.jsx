import { useEffect, useState } from "react";
import api from "../api/api";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";

export default function PublicDonation() {
  const [funds, setFunds] = useState([]);
  const [form, setForm] = useState({
    donor_name: "",
    donor_phone: "",
    fund_id: "",
    amount: "",
    payment_mode: "UPI",
    reference_no: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/public/association-info").then((res) => {
      setFunds(res.data.data.funds || []);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/public/donate", form);
      setMsg("🙏 Thank you! Donation submitted successfully");
      setForm({
        donor_name: "",
        donor_phone: "",
        fund_id: "",
        amount: "",
        payment_mode: "UPI",
        reference_no: "",
      });
    } catch (err) {
      alert("Donation failed");
    }
  };

  return (
    <>
      <PublicNavbar />

      <div style={page}>
        <h2>🙏 Donate to Our Association</h2>

        {msg && <p style={{ color: "green" }}>{msg}</p>}

        <form onSubmit={submit} style={box}>
          <input
            placeholder="Your Name (optional)"
            value={form.donor_name}
            onChange={(e) =>
              setForm({ ...form, donor_name: e.target.value })
            }
            style={input}
          />

          <input
            placeholder="Phone (optional)"
            value={form.donor_phone}
            onChange={(e) =>
              setForm({ ...form, donor_phone: e.target.value })
            }
            style={input}
          />

          <select
            value={form.fund_id}
            onChange={(e) =>
              setForm({ ...form, fund_id: e.target.value })
            }
            style={input}
            required
          >
            <option value="">Select Fund</option>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.fund_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            style={input}
            required
          />

          <select
            value={form.payment_mode}
            onChange={(e) =>
              setForm({ ...form, payment_mode: e.target.value })
            }
            style={input}
          >
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="BANK">Bank Transfer</option>
          </select>

          <input
            placeholder="Transaction Reference"
            value={form.reference_no}
            onChange={(e) =>
              setForm({ ...form, reference_no: e.target.value })
            }
            style={input}
          />

          <button style={btn} type="submit">
            Donate
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

/* ================= STYLES ================= */

const page = {
  maxWidth: 500,
  margin: "60px auto",
  padding: 20,
  textAlign: "center",
};

const box = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
};

const btn = {
  width: "100%",
  padding: 14,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  cursor: "pointer",
};
