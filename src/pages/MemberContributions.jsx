import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function MemberContributions() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [list, setList] = useState([]);
  const [success, setSuccess] = useState("");

  const loadMyContributions = async () => {
    try {
      const res = await api.get("/contributions/my");
      setList(res.data);
    } catch {
      setList([]);
    }
  };

  const submitContribution = async e => {
    e.preventDefault();
    setSuccess("");

    try {
      await api.post("/contributions/submit", {
        amount,
        note,
      });

      setSuccess("✅ Contribution submitted");
      setAmount("");
      setNote("");
      loadMyContributions();
    } catch {
      alert("Failed to submit contribution");
    }
  };

  useEffect(() => {
    loadMyContributions();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <h2>💰 My Contributions</h2>

        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={submitContribution}>
          <input
            type="number"
            placeholder="Amount"
            required
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <br /><br />
          <textarea
            placeholder="Note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <br /><br />
          <button type="submit">Submit</button>
        </form>

        <hr />

        <table width="100%" border="1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Fund</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id}>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>{c.fund_name ?? "General"}</td>
                <td>₹{c.amount}</td>
                <td>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
