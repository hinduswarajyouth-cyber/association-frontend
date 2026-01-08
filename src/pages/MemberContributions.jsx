import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

/* GET ROLE FROM TOKEN */
const getRole = () => {
  try {
    const token = localStorage.getItem("token");
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    return null;
  }
};

const ROLE = getRole();
const FINANCE_ROLES = ["SUPER_ADMIN", "PRESIDENT", "TREASURER"];

export default function MemberContributions() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    fund_name: "GENERAL",
    note: "",
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const url = FINANCE_ROLES.includes(ROLE)
      ? "/api/contributions/all"
      : "/api/contributions/my";

    const res = await api.get(url);
    setList(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async () => {
    if (!form.amount) return alert("Amount required");
    await api.post("/api/contributions/submit", form);
    setForm({ amount: "", fund_name: "GENERAL", note: "" });
    loadData();
  };

  const approve = async (id) => {
    await api.put(`/api/contributions/approve/${id}`);
    loadData();
  };

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>💰 Contributions</h2>

        {/* SUBMIT */}
        <div style={card}>
          <h4>Make Contribution</h4>
          <input
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            placeholder="Fund Name"
            value={form.fund_name}
            onChange={(e) => setForm({ ...form, fund_name: e.target.value })}
          />
          <textarea
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <button onClick={submit}>Submit</button>
        </div>

        {/* LIST */}
        {loading && <p>Loading...</p>}
        {!loading && list.length === 0 && <p>No contributions</p>}

        {list.map((c) => (
          <div key={c.id} style={card}>
            <strong>₹ {c.amount}</strong> — {c.fund_name}
            <p>Status: {c.payment_status}</p>
            {c.member_name && <p>By: {c.member_name}</p>}
            {FINANCE_ROLES.includes(ROLE) &&
              c.payment_status === "PENDING" && (
                <button onClick={() => approve(c.id)}>Approve</button>
              )}
          </div>
        ))}
      </div>
    </>
  );
}

/* STYLES */
const page = { padding: 30, background: "#f1f5f9", minHeight: "100vh" };
const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  marginBottom: 14,
};
