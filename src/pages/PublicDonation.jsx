import { useEffect, useState } from "react";
import api from "../api/api";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";

/* =========================
   🔑 UPI CONFIG
========================= */
const UPI_ID = "yourupi@bank"; // 🔴 CHANGE THIS
const UPI_NAME = "Hinduswaraj Youth Welfare Association";

export default function PublicDonation() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [donor_name, setDonorName] = useState("");
  const [donor_phone, setDonorPhone] = useState("");
  const [fund_id, setFundId] = useState("");
  const [amount, setAmount] = useState("");
  const [payment_mode, setPaymentMode] = useState("");
  const [reference_no, setReferenceNo] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  /* =========================
     LOAD FUNDS
  ========================= */
  useEffect(() => {
    api
      .get("/public/association-info")
      .then((res) => {
        setFunds(res.data.data.funds || []);
      })
      .catch(() => setError("Failed to load funds"))
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     UPI QR GENERATOR
  ========================= */
  const getUpiQrUrl = (amt) => {
    const upiString =
      `upi://pay?pa=${UPI_ID}` +
      `&pn=${encodeURIComponent(UPI_NAME)}` +
      `&am=${amt}` +
      `&cu=INR`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
      upiString
    )}`;
  };

  /* =========================
     SUBMIT DONATION
  ========================= */
  const submit = async () => {
    setError("");
    setMsg("");

    if (!fund_id || !amount || !payment_mode) {
      setError("Please fill all required fields");
      return;
    }

    if (payment_mode === "UPI" && !reference_no) {
      setError("UTR / Reference number is required for UPI");
      return;
    }

    try {
      await api.post("/public/donate", {
        donor_name,
        donor_phone,
        fund_id,
        amount,
        payment_mode,
        reference_no,
      });

      setMsg("🙏 Thank you! Donation submitted successfully");

      // reset
      setDonorName("");
      setDonorPhone("");
      setFundId("");
      setAmount("");
      setPaymentMode("");
      setReferenceNo("");
    } catch (err) {
      setError(err.response?.data?.error || "Donation failed");
    }
  };

  if (loading) {
    return <div style={{ padding: 60 }}>Loading...</div>;
  }

  return (
    <>
      <PublicNavbar />

      <div style={page}>
        <h2>🙏 Make a Donation</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}

        <input
          placeholder="Your Name (optional)"
          value={donor_name}
          onChange={(e) => setDonorName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Phone Number (optional)"
          value={donor_phone}
          onChange={(e) => setDonorPhone(e.target.value)}
          style={input}
        />

        <select
          value={fund_id}
          onChange={(e) => setFundId(e.target.value)}
          style={input}
        >
          <option value="">Select Fund *</option>
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.fund_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        <select
          value={payment_mode}
          onChange={(e) => setPaymentMode(e.target.value)}
          style={input}
        >
          <option value="">Payment Mode *</option>
          <option value="UPI">UPI</option>
          <option value="CASH">Cash</option>
          <option value="BANK">Bank Transfer</option>
        </select>

        {/* ===== AUTO UPI QR ===== */}
        {payment_mode === "UPI" && amount > 0 && (
          <div style={qrBox}>
            <h4>Scan & Pay</h4>

            <img
              src={getUpiQrUrl(amount)}
              alt="UPI QR"
              style={{ width: 260 }}
            />

            <p style={{ marginTop: 10 }}>
              Pay ₹{amount} to <b>{UPI_NAME}</b>
            </p>

            <p style={{ fontSize: 12, color: "#64748b" }}>
              After payment, enter UTR below 👇
            </p>
          </div>
        )}

        {/* ===== UTR ===== */}
        {payment_mode === "UPI" && (
          <input
            placeholder="UTR / Reference Number *"
            value={reference_no}
            onChange={(e) => setReferenceNo(e.target.value)}
            style={input}
          />
        )}

        <button style={btn} onClick={submit}>
          Submit Donation
        </button>
      </div>

      <Footer />
    </>
  );
}

/* =========================
   STYLES
========================= */
const page = {
  maxWidth: 420,
  margin: "40px auto",
  padding: 20,
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const btn = {
  width: "100%",
  padding: 14,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer",
};

const qrBox = {
  marginTop: 20,
  padding: 16,
  border: "1px dashed #94a3b8",
  borderRadius: 12,
};
