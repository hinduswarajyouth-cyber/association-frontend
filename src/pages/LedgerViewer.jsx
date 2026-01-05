import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function LedgerViewer() {
  const [ledger, setLedger] = useState([]);
  const [funds, setFunds] = useState([]);
  const [fundId, setFundId] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD FUNDS + LEDGER
  ========================= */
  const loadData = async () => {
    try {
      const [fundRes, ledgerRes] = await Promise.all([
        api.get("/funds"),
        api.get("/ledger", {
          params: fundId ? { fund_id: fundId } : {},
        }),
      ]);

      setFunds(fundRes.data);
      setLedger(ledgerRes.data);
    } catch (err) {
      alert("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fundId]);

  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Ledger (Read-Only)</h2>

        {/* =========================
            FUND FILTER
        ========================= */}
        <div style={{ marginBottom: 20 }}>
          <label>Filter by Fund: </label>
          <select
            value={fundId}
            onChange={(e) => setFundId(e.target.value)}
          >
            <option value="">All Funds</option>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.fund_name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading ledger...</p>
        ) : ledger.length === 0 ? (
          <p>No ledger entries</p>
        ) : (
          <table
            border="1"
            cellPadding="8"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Fund</th>
                <th>Type</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((l) => (
                <tr key={l.id}>
                  <td>
                    {new Date(l.created_at).toLocaleDateString()}
                  </td>
                  <td>{l.fund_name}</td>
                  <td>
                    <span
                      style={{
                        color:
                          l.entry_type === "CREDIT"
                            ? "green"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {l.entry_type}
                    </span>
                  </td>
                  <td>{l.source}</td>
                  <td>₹{l.amount}</td>
                  <td>₹{l.balance_after}</td>
                  <td>{l.created_by_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
