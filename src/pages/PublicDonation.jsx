import { useEffect, useState } from "react";
import api from "../api/api";
import PublicNavbar from "../components/PublicNavbar";

export default function PublicDonation() {
  const [form, setForm] = useState({
    donor_name: "",
    donor_phone: "",
    fund_id: "",
    amount: "",
    payment_mode: "UPI",
    reference_no: "",
  });

  const [association, setAssociation] = useState(null);
  const [funds, setFunds] = useState([]);
  const [success, setSuccess] = useState(false);

  /* =========================
     LOAD ASSOCIATION INFO
  ========================= */
  useEffect(() => {
    api.get("/public/association").then((res) => {
      setAssociation(res.data);
    });

    api.get("/public/funds").then((res) => {
      setFunds(res.data || []);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/public/donate", form);
    setSuccess(true);

    setForm({
      donor_name: "",
      donor_phone: "",
      fund_id: "",
      amount: "",
      payment_mode: "UPI",
      reference_no: "",
    });
  };

  return (
    <>
      {/* ✅ PUBLIC NAVBAR */}
      <PublicNavbar />

      <div style={page}>
        <h2>🙏 Donate to Our Association</h2>

        {success && (
          <p style={{ color: "green" }}>
            Thank you! Donation submitted successfully 🙏
          </p>
        )}

        <form onSubmit={submit} style={card}>
          <input
            name="donor_name"
            placeholder="Your Name (optional)"
            value={form.donor_name}
            onChange={handleChange}
          />

          <input
            name="donor_phone"
            placeholder="Phone (optional)"
            value={form.donor_phone}
            onChange={handleChange}
          />

          {/* FUND SELECT */}
          <select
            name="fund_id"
            value={form.fund_id}
            onChange={handleChange}
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
            name="amount"
            placeholder="Amount"
            value={form.amount}
            required
            onChange={handleChange}
          />

          <select
            name="payment_mode"
            value={form.payment_mode}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="BANK">Bank Transfer</option>
          </select>

          {/* 🔥 UPI SECTION */}
          {form.payment_mode === "UPI" && association && (
            <div style={upiBox}>
              {association.upi_id && (
                <p>
                  <b>UPI ID:</b> {association.upi_id}
                </p>
              )}

              {association.upi_qr_url && (
                <img
                  src={association.upi_qr_url}
                  alt="UPI QR"
                  style={{ width: 180 }}
                />
              )}

              <p style={{ fontSize: 12 }}>
                Scan & pay → Enter transaction reference below
              </p>
            </div>
          )}

          {form.payment_mode === "UPI" && (
            <input
              name="reference_no"
              placeholder="Transaction Reference"
              value={form.reference_no}
              required
              onChange={handleChange}
            />
          )}

          <button style={btn}>Donate</button>
        </form>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

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

const btn = {
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
