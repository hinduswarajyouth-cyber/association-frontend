import { useEffect, useState } from "react";
import api from "../api/api";

export default function PublicDonation() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    fund: "",
    amount: "",
    payment_mode: "UPI",
    reference: "",
  });

  const [association, setAssociation] = useState(null);
  const [success, setSuccess] = useState(false);

  /* LOAD ASSOCIATION INFO */
  useEffect(() => {
    api.get("/public/association-info").then((res) => {
      setAssociation(res.data.data);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/public/donate", form);
    setSuccess(true);
  };

  return (
    <div style={page}>
      <h2>🙏 Donate to Our Association</h2>

      {success && <p style={{ color: "green" }}>Thank you! Donation submitted</p>}

      <form onSubmit={submit} style={card}>
        <input name="name" placeholder="Your Name (optional)" onChange={handleChange} />
        <input name="phone" placeholder="Phone (optional)" onChange={handleChange} />

        <select name="fund" onChange={handleChange} required>
          <option value="">Select Fund</option>
          <option value="Monthly Subscription">Monthly Subscription</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          required
          onChange={handleChange}
        />

        <select name="payment_mode" onChange={handleChange}>
          <option value="UPI">UPI</option>
          <option value="CASH">Cash</option>
          <option value="BANK">Bank Transfer</option>
        </select>

        {/* 🔥 UPI QR SECTION */}
        {form.payment_mode === "UPI" && association && (
          <div style={upiBox}>
            <p><b>UPI ID:</b> {association.upi_id}</p>
            <img
              src={association.upi_qr_url}
              alt="UPI QR"
              style={{ width: 180 }}
            />
            <p style={{ fontSize: 12 }}>
              Scan & pay → Enter transaction reference below
            </p>
          </div>
        )}

        {form.payment_mode === "UPI" && (
          <input
            name="reference"
            placeholder="Transaction Reference"
            required
            onChange={handleChange}
          />
        )}

        <button>Donate</button>
      </form>
    </div>
  );
}

/* STYLES */
const page = { padding: 40, textAlign: "center" };
const card = {
  maxWidth: 360,
  margin: "auto",
  padding: 20,
  background: "#fff",
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
const upiBox = {
  background: "#f1f5f9",
  padding: 12,
  borderRadius: 10,
};
