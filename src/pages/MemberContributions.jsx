import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

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
    try {
      const res = await api.get("/funds/list");
      setFunds(res.data || []); // ✅ FIX
    } catch (err) {
      console.error("LOAD FUNDS ERROR 👉", err);
    }
  };

  const loadContributions = async () => {
    try {
      const res = await api.get("/members/contributions");
      setContributions(res.data || []); // ✅ FIX
    } catch (err) {
      console.error("LOAD CONTRIBUTIONS ERROR 👉", err);
    }
  };

  /* =========================
     SUBMIT CONTRIBUTION
  ========================= */
  const submit = async () => {
    if (!fundId || !amount) {
      alert("Please fill all required fields");
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
    try {
      const res = await api.get(
        `/receipts/pdf/${receiptNo}`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${receiptNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download receipt");
    }
  };

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2>💰 New Contribution</h2>

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

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          style={input}
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="BANK">Bank Transfer</option>
        </select>

        {paymentMode !== "CASH" && (
          <input
            placeholder="Reference No"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            style={input}
          />
        )}

        <button onClick={submit} disabled={loading} style={btn}>
          {loading ? "Submitting..." : "Submit Contribution"}
        </button>

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
                      <button onClick={() => downloadReceipt(c.receipt_no)}>
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
const btn = {
  width: "100%",
  padding: 12,
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
const table = { width: "100%", borderCollapse: "collapse", marginTop: 15 };
