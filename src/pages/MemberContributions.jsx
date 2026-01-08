import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   CONSTANTS
========================= */
const UPI_ID = "hinduswarajyouth@ybl";
const PAYEE_NAME = "Hindu Swarajya Youth";

export default function MemberContributions() {
  const [funds, setFunds] = useState([]);
  const [contributions, setContributions] = useState([]);

  const [fundId, setFundId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [referenceNo, setReferenceNo] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    loadFunds();
    loadContributions();
  }, []);

  const loadFunds = async () => {
    const res = await api.get("/funds/list");
    setFunds(res.data?.funds || []);
  };

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
    if (!fundId || !amount) return alert("Fund & amount required");

    if (paymentMethod !== "CASH" && !referenceNo)
      return alert("Reference number required");

    setLoading(true);
    try {
      await api.post("/funds/contribute", {
        fund_id: fundId,
        amount,
        payment_mode: paymentMethod,
        reference_no: referenceNo || null,
        note,
      });

      alert("✅ Contribution submitted (Pending approval)");

      setAmount("");
      setReferenceNo("");
      setNote("");
      setPaymentMethod("CASH");
      setFundId("");

      loadContributions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RECEIPT DOWNLOAD
  ========================= */
  const downloadReceipt = async (receiptNo) => {
    const res = await api.get(`/receipts/pdf/${receiptNo}`, {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${receiptNo}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  /* =========================
     RECEIPT VERIFY (PUBLIC)
  ========================= */
  const verifyUrl = (receiptNo) =>
    `https://api.hinduswarajyouth.online/receipts/verify/${receiptNo}`;

  /* =========================
     UPI QR
  ========================= */
  const upiQrUrl =
    amount && paymentMethod === "UPI"
      ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
          `upi://pay?pa=${UPI_ID}&pn=${PAYEE_NAME}&am=${amount}&cu=INR`
        )}`
      : null;

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2>💰 Contribution</h2>

        {/* FUND */}
        <select value={fundId} onChange={(e) => setFundId(e.target.value)} style={input}>
          <option value="">Select Fund</option>
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.fund_name}
            </option>
          ))}
        </select>

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

        {/* PAYMENT MODE */}
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
              <div style={{ textAlign: "center" }}>
                <img src={upiQrUrl} alt="UPI QR" />
                <p style={{ fontSize: 12 }}>UPI ID: {UPI_ID}</p>
              </div>
            )}
          </>
        )}

        {/* REF */}
        {paymentMethod !== "CASH" && (
          <input
            placeholder="Reference No"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            style={input}
          />
        )}

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
          <table style={table} border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Fund</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Receipt</th>
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
                            : c.payment_status === "REJECTED"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {c.payment_status}
                    </b>
                  </td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    {c.payment_status === "APPROVED" ? (
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
   STYLES
========================= */
const container = { padding: 30, maxWidth: 850 };
const input = { width: "100%", padding: 10, marginBottom: 12 };
const quickRow = { display: "flex", gap: 10, marginBottom: 10 };
const quickBtn = {
  padding: "6px 14px",
  borderRadius: 20,
  border: "1px solid #2563eb",
  background: "#eff6ff",
};
const upiBtn = {
  width: "100%",
  padding: 12,
  background: "#0f9d58",
  color: "#fff",
  borderRadius: 8,
  marginBottom: 12,
};
const submitBtn = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
};
const table = { width: "100%", marginTop: 15 };
