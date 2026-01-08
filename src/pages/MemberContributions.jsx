import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   CONSTANTS
========================= */
const UPI_ID = "hinduswarajyouth@ybl";
const PAYEE_NAME = "Hindu Swarajya Youth";

export default function MemberContributions() {
  const [contributions, setContributions] = useState([]);

  const [fundName, setFundName] = useState("GENERAL");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD CONTRIBUTIONS
  ========================= */
  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    const res = await api.get("/api/contributions/my");
    setContributions(res.data || []);
  };

  /* =========================
     UPI PAY
  ========================= */
  const openUpiApp = () => {
    if (!amount) return alert("Enter amount");

    const noteText = "Association Contribution";
    const url =
      `upi://pay?pa=${UPI_ID}` +
      `&pn=${encodeURIComponent(PAYEE_NAME)}` +
      `&am=${amount}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(noteText)}`;

    window.location.href = url;
  };

  /* =========================
     SUBMIT CONTRIBUTION
  ========================= */
  const submit = async () => {
    if (!amount) return alert("Amount required");

    setLoading(true);
    try {
      await api.post("/api/contributions/submit", {
        amount,
        fund_name: fundName,
        payment_method: paymentMethod,
        note,
      });

      alert("✅ Contribution submitted (Pending approval)");

      setAmount("");
      setNote("");
      setPaymentMethod("CASH");
      setFundName("GENERAL");

      loadContributions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPI QR
  ========================= */
  const upiQrUrl = amount
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        `upi://pay?pa=${UPI_ID}&pn=${PAYEE_NAME}&am=${amount}&cu=INR`
      )}`
    : null;

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2>💰 Contribution</h2>

        {/* FUND NAME */}
        <input
          placeholder="Fund Name (GENERAL)"
          value={fundName}
          onChange={(e) => setFundName(e.target.value)}
          style={input}
        />

        {/* QUICK AMOUNTS */}
        <div style={quickRow}>
          {[116, 216, 516].map((v) => (
            <button key={v} onClick={() => setAmount(v)} style={quickBtn}>
              ₹{v}
            </button>
          ))}
        </div>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        {/* PAYMENT METHOD */}
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={input}
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="BANK">Bank Transfer</option>
        </select>

        {/* UPI */}
        {paymentMethod === "UPI" && (
          <>
            <button style={upiBtn} onClick={openUpiApp}>
              📲 Pay via UPI
            </button>

            {upiQrUrl && (
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <img src={upiQrUrl} alt="UPI QR" />
                <p style={{ fontSize: 12 }}>UPI ID: {UPI_ID}</p>
              </div>
            )}
          </>
        )}

        {/* NOTE */}
        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={input}
        />

        <button onClick={submit} disabled={loading} style={submitBtn}>
          {loading ? "Submitting..." : "Submit Contribution"}
        </button>

        {/* HISTORY */}
        <h3 style={{ marginTop: 30 }}>📜 My Contributions</h3>

        {contributions.length === 0 ? (
          <p>No contributions yet</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th>Fund</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c.id}>
                  <td>{c.fund_name}</td>
                  <td>₹{c.amount}</td>
                  <td>{c.payment_method}</td>
                  <td>
                    <b
                      style={{
                        color:
                          c.payment_status === "APPROVED"
                            ? "green"
                            : "orange",
                      }}
                    >
                      {c.payment_status}
                    </b>
                  </td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */
const container = { padding: 30, maxWidth: 800 };
const input = { width: "100%", padding: 10, marginBottom: 12 };

const quickRow = { display: "flex", gap: 10, marginBottom: 10 };

const quickBtn = {
  padding: "6px 14px",
  borderRadius: 20,
  border: "1px solid #2563eb",
  background: "#eff6ff",
  cursor: "pointer",
};

const upiBtn = {
  width: "100%",
  padding: 12,
  background: "#0f9d58",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  marginBottom: 12,
};

const submitBtn = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 15,
};
