import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function TreasurerDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    try {
      const res = await api.get("/treasurer/pending");
      setPending(res.data.pending);
    } catch (err) {
      alert("Failed to load pending contributions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approve = async (id) => {
    if (!window.confirm("Approve this contribution?")) return;
    await api.patch(`/treasurer/approve/${id}`);
    loadPending();
  };

  const reject = async (id) => {
    if (!window.confirm("Reject this contribution?")) return;
    await api.patch(`/treasurer/reject/${id}`);
    loadPending();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>Treasurer – Pending Contributions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : pending.length === 0 ? (
          <p>No pending contributions</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Member</th>
                <th>Fund</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id}>
                  <td>{p.member_name}</td>
                  <td>{p.fund_name}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.payment_mode}</td>
                  <td>{p.reference_no || "-"}</td>
                  <td>{new Date(p.created_at).toDateString()}</td>
                  <td>
                    <button onClick={() => approve(p.id)}>Approve</button>{" "}
                    <button onClick={() => reject(p.id)}>Reject</button>
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