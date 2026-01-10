import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   CONSTANTS
========================= */
const UPI_ID = "hinduswarajyouth@ybl";
const PAYEE_NAME = "Hindu Swaraj Youth Welfare Association";

export default function Contributions() {
  const [funds, setFunds] = useState([]);
  const [history, setHistory] = useState([]);

  const [fundId, setFundId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [referenceNo, setReferenceNo] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    loadFunds();
    loadHistory();
  }, []);

  const loadFunds = async () => {
    const res = await api.get("/funds/list");
    setFunds(res.data?.funds || []);
  };

  const loadHistory = async () => {
    const res = await api.get("/contributions/my");
    setHistory(res.data || []);
  };

  /* =========================
     UPI URL (GPay / PhonePe)
  ========================= */
  const upiUrl = amount
    ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
        PAYEE_NAME
      )}&am=${amount}&cu=INR&tn=${encodeURIComponent(
        "Association Contribution"
      )}`
    : "";

  /* =========================
     PAY NOW
  ========================= */
  const payNow = () => {
    if (!amount) return alert("Enter amount first");
    window.location.href = upiUrl; // redirects to GPay / PhonePe
  };

  /* =========================
     SUBMIT CONTRIBUTION
  ========================= */
  const submit = async () => {
    if (!fundId || !amount) {
      alert("Fund & Amount required");
      return;
    }

    if (paymentMode !== "CASH" && !referenceNo) {
      alert("Reference number is mandatory");
      return;
    }

    setLoading(true);
    try {
      await api.post("/funds/contribute", {
        fund_id: fundId,
        amount,
        payment_mode: paymentMode,
        reference_no: paymentMode === "CASH" ? null : referenceNo,
        note,
      });

      alert("✅ Contribution submitted (Pending approval)");

      setFundId("");
      setAmount("");
      setPaymentMode("CASH");
      setReferenceNo("");
      setNote("");

      loadHistory();
    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RECEIPT
  ========================= */
  const downloadReceipt = async (no) => {
    const res = await api.get(`/receipts/pdf/${no}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = `${no}.pdf`;
    a.click();
  };

  const verifyUrl = (no) =>
    `https://api.hinduswarajyouth.online/receipts/verify/${no}`;

  /* =========================
     UPI QR
  ========================= */
  const upiQr =
    paymentMode === "UPI" && amount
      ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
          upiUrl
        )}`
      : null;

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2>💰 Contributions</h2>

        {/* ================= FORM ================= */}
        <div style={card}>
          <h3>Make a Contribution</h3>

          <select
            style={input}
            value={fundId}
            onChange={(e) => setFundId(e.target.value)}
          >
            <option value="">Select Fund</option>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.fund_name}
              </option>
            ))}
          </select>

          {/* Quick Amount */}
          <div style={quickRow}>
            {[116, 216, 516, 1000].map((v) => (
              <button key={v} style={chip} onClick={() => setAmount(v)}>
                ₹{v}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Amount"
            style={input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            style={input}
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI (GPay / PhonePe)</option>
            <option value="BANK">Bank Transfer</option>
          </select>

          {/* ================= UPI ================= */}
          {paymentMode === "UPI" && (
            <>
              <button style={upiBtn} onClick={payNow}>
                📲 Pay Now (GPay / PhonePe)
              </button>

              {upiQr && (
                <div style={{ textAlign: "center" }}>
                  <img src={upiQr} alt="UPI QR" />
                  <p style={{ fontSize: 12 }}>
                    UPI ID: <b>{UPI_ID}</b>
                  </p>
                </div>
              )}
            </>
          )}

          {/* ================= REF ================= */}
          {paymentMode !== "CASH" && (
            <input
              placeholder="Transaction Reference Number"
              style={input}
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
            />
          )}

          <textarea
            placeholder="Note (optional)"
            style={textarea}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button style={submitBtn} onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Contribution"}
          </button>
        </div>

        {/* ================= HISTORY ================= */}
        <h3 style={{ marginTop: 30 }}>📜 My Contributions</h3>

        {history.length === 0 ? (
          <p>No contributions yet</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th>Fund</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {history.map((c) => (
                <tr key={c.id}>
                  <td>{c.fund_name}</td>
                  <td>₹{c.amount}</td>
                  <td>{c.payment_mode}</td>
                  <td>
                    <b
                      style={{
                        color:
                          c.status === "APPROVED"
                            ? "green"
                            : c.status === "REJECTED"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {c.status}
                    </b>
                  </td>
                  <td>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {c.status === "APPROVED" ? (
                      <>
                        <button onClick={() => downloadReceipt(c.receipt_no)}>
                          PDF
                        </button>{" "}
                        <a
                          href={verifyUrl(c.receipt_no)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Verify
                        </a>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
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
   STYLES (PREMIUM)
========================= */
const page = { padding: 30, maxWidth: 900, margin: "auto" };
const card = {
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};
const input = { width: "100%", padding: 12, marginBottom: 12 };
const textarea = { width: "100%", height: 80, padding: 12 };
const quickRow = { display: "flex", gap: 10, marginBottom: 10 };
const chip = {
  borderRadius: 20,
  border: "1px solid #2563eb",
  padding: "6px 14px",
  background: "#eff6ff",
};
const upiBtn = {
  width: "100%",
  padding: 12,
  background: "#16a34a",
  color: "#fff",
  borderRadius: 10,
  marginBottom: 10,
};
const submitBtn = {
  width: "100%",
  padding: 14,
  background: "#2563eb",
  color: "#fff",
  borderRadius: 10,
};
const table = { width: "100%", marginTop: 16, borderCollapse: "collapse" };
