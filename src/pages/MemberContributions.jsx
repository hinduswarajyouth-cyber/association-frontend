import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* =========================
   CONSTANTS
========================= */
const UPI_ID = "hinduswarajyouth@ybl";
const PAYEE_NAME = "Hindu Swarajya Youth";

export default function MemberContribution() {
  const [funds, setFunds] = useState([]);
  const [contributions, setContributions] = useState([]);

  const [fundId, setFundId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [referenceNo, setReferenceNo] = useState("");
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
    setFunds(res.data || []);
  };

  const loadContributions = async () => {
    const res = await api.get("/members/contributions");
    setContributions(res.data || []);
  };

  /* =========================
     UPI PAY NOW
  ========================= */
  const openUpiApp = () => {
    if (!amount) {
      alert("Enter amount first");
      return;
    }

    const note = "Association Contribution";
    const upiUrl =
      `upi://pay?pa=${UPI_ID}` +
      `&pn=${encodeURIComponent(PAYEE_NAME)}` +
      `&am=${amount}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(note)}`;

    window.location.href = upiUrl;
  };

  /* =========================
     SUBMIT CONTRIBUTION
  ========================= */
  const submit = async () => {
    if (!fundId || !amount) {
      alert("Please select fund and amount");
      return;
    }

    if (paymentMode !== "CASH" && !referenceNo) {
      alert("Reference number required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/funds/contribute", {
        fund_id: fundId,
        amount,
        payment_mode: paymentMode,
        reference_no: paymentMode === "CASH" ? null : referenceNo,
      });

      alert("✅ Contribution submitted (Pending approval)");

      setFundId("");
      setAmount("");
      setPaymentMode("CASH");
      setReferenceNo("");

      loadContributions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DOWNLOAD RECEIPT
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
        <h2>💰 New Contribution</h2>

        {/* FUND */}
        <select
          value={fundId}
          onChange={(e) => setFundId(e.target.value)}
          style={input}
        >
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
            <button
              key={v}
              onClick={() => setAmount(v)}
              style={quickBtn}
            >
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
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          style={input}
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI (GPay / PhonePe)</option>
          <option value="BANK">Bank Transfer</option>
        </select>

        {/* UPI PAY NOW */}
        {paymentMode === "UPI" && (
          <>
            <button style={upiBtn} onClick={openUpiApp}>
              📲 Pay Now via UPI
            </button>

            {upiQrUrl && (
              <div style={{ textAlign: "center", marginBottom: 15 }}>
                <p>Scan & Pay</p>
                <img src={upiQrUrl} alt="UPI QR" />
                <p style={{ fontSize: 12 }}>
                  UPI ID: <b>{UPI_ID}</b>
                </p>
              </div>
            )}
          </>
        )}

        {/* REFERENCE */}
        {paymentMode !== "CASH" && (
          <input
            placeholder="UPI / Bank Reference No"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            style={input}
          />
        )}

        <button onClick={submit} disabled={loading} style={submitBtn}>
          {loading ? "Submitting..." : "Submit Contribution"}
        </button>

        {/* HISTORY */}
        <h3 style={{ marginTop: 40 }}>📜 My Contributions</h3>

        {contributions.length === 0 ? (
          <p>No contributions yet</p>
        ) : (
          <table style={table} border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Fund</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Ref</th>
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
                  <td>{c.payment_mode}</td>
                  <td>{c.reference_no || "-"}</td>
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
                    {c.receipt_date
                      ? new Date(c.receipt_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {c.status === "APPROVED" ? (
                      <button
                        onClick={() => downloadReceipt(c.receipt_no)}
                      >
                        Download PDF
                      </button>
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
const container = { padding: 30, maxWidth: 800 };
const input = { width: "100%", padding: 10, marginBottom: 12 };

const quickRow = {
  display: "flex",
  gap: 10,
  marginBottom: 10,
};

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
  cursor: "pointer",
};

const submitBtn = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 15,
};
