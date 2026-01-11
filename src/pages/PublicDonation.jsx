import { useEffect, useState } from "react";
import api from "../api/api";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";

const UPI_ID = "yourupi@bank";   // change
const UPI_NAME = "Hinduswaraj Youth Welfare Association";

export default function PublicDonation() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [donor_name, setDonorName] = useState("");
  const [donor_phone, setDonorPhone] = useState("");
  const [donor_email, setDonorEmail] = useState("");
  const [fund_id, setFundId] = useState("");
  const [amount, setAmount] = useState("");
  const [payment_mode, setPaymentMode] = useState("");
  const [reference_no, setReferenceNo] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/public/association-info")
      .then(res => setFunds(res.data.data.funds || []))
      .catch(() => setError("Failed to load donation funds"))
      .finally(() => setLoading(false));
  }, []);

  const getUpiQrUrl = (amt) => {
    const upi = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amt}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upi)}`;
  };

  const submit = async () => {
    setError("");
    setMsg("");

    if (!donor_email || !fund_id || !amount || !payment_mode) {
      setError("Please fill all required fields");
      return;
    }

    if (payment_mode === "UPI" && !reference_no) {
      setError("UTR / Reference is required");
      return;
    }

    try {
      await api.post("/public/donate", {
        donor_name,
        donor_phone,
        donor_email,
        fund_id,
        amount,
        payment_mode,
        reference_no
      });

      setMsg("🙏 Thank you for supporting our Youth Welfare initiatives.");
      setDonorName("");
      setDonorPhone("");
      setDonorEmail("");
      setFundId("");
      setAmount("");
      setPaymentMode("");
      setReferenceNo("");
    } catch (e) {
      setError(e.response?.data?.error || "Donation failed");
    }
  };

  if (loading) return <div style={{ padding: 60 }}>Loading…</div>;

  return (
    <>
      <PublicNavbar />

      <div style={page}>
        <h1 style={title}>🙏 Support Youth Welfare & Social Service</h1>
        <p style={sub}>
          Your contribution helps us run education, health, relief and community programs
        </p>

        {error && <div style={errorBox}>{error}</div>}
        {msg && <div style={successBox}>{msg}</div>}

        <div style={card}>
          <input placeholder="Full Name (optional)" value={donor_name} onChange={e=>setDonorName(e.target.value)} style={input}/>
          <input placeholder="Phone (optional)" value={donor_phone} onChange={e=>setDonorPhone(e.target.value)} style={input}/>
          <input placeholder="Email (required)" value={donor_email} onChange={e=>setDonorEmail(e.target.value)} style={input}/>

          <select value={fund_id} onChange={e=>setFundId(e.target.value)} style={input}>
            <option value="">Select Seva / Fund</option>
            {funds.map(f=>(
              <option key={f.id} value={f.id}>{f.fund_name}</option>
            ))}
          </select>

          <input type="number" placeholder="Donation Amount ₹" value={amount} onChange={e=>setAmount(e.target.value)} style={input}/>

          <select value={payment_mode} onChange={e=>setPaymentMode(e.target.value)} style={input}>
            <option value="">Payment Method</option>
            <option value="UPI">UPI</option>
            <option value="BANK">Bank Transfer</option>
            <option value="CASH">Cash</option>
          </select>

          {payment_mode === "UPI" && amount > 0 && (
            <div style={qrBox}>
              <h3>Scan to Donate</h3>
              <img src={getUpiQrUrl(amount)} style={{ width: 240 }} />
              <p>Pay ₹{amount} to <b>{UPI_NAME}</b></p>
            </div>
          )}

          {payment_mode === "UPI" && (
            <input
              placeholder="UTR / Reference No"
              value={reference_no}
              onChange={e=>setReferenceNo(e.target.value)}
              style={input}
            />
          )}

          <button onClick={submit} style={btn}>🙏 Submit Donation</button>
        </div>

        {/* ====== NGO Trust Message ====== */}
        <div style={noteBox}>
          <p>
            Hinduswaraj Youth Welfare Association is a registered non-profit organization.
            All donations are used strictly for education, health, social welfare and
            community development activities.
          </p>
        </div>

      </div>

      <Footer />
    </>
  );
}

/* ========== STYLES ========== */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(to bottom, #fff7ed, #fefce8)",
  padding: "60px 15px",
  textAlign: "center"
};

const title = {
  fontSize: "2.2rem",
  color: "#7c2d12",
  fontWeight: "800",
  marginBottom: 10
};

const sub = {
  color: "#854d0e",
  fontSize: 15,
  marginBottom: 30
};

const card = {
  maxWidth: 420,
  margin: "auto",
  background: "#fff",
  padding: 28,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #facc15",
  background: "#fffbea",
  fontSize: 14
};

const btn = {
  width: "100%",
  padding: 14,
  background: "linear-gradient(to right, #ca8a04, #854d0e)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: "700",
  marginTop: 10,
  cursor: "pointer"
};

const qrBox = {
  margin: "15px 0",
  padding: 15,
  background: "#fffbeb",
  borderRadius: 12,
  border: "1px dashed #facc15"
};

const noteBox = {
  maxWidth: 420,
  margin: "20px auto",
  fontSize: 13,
  color: "#7c2d12",
  background: "#fff7ed",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #fde68a"
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10
};

const successBox = {
  background: "#dcfce7",
  color: "#166534",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10
};
