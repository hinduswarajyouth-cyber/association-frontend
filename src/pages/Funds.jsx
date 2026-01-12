import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Funds() {
  const [funds, setFunds] = useState([]);

  /* ADD FUND */
  const [newFund, setNewFund] = useState({
    fund_name: "",
    fund_type: "MONTHLY",
    balance: "",
  });

  /* EDIT FUND */
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    fund_name: "",
    fund_type: "MONTHLY",
    balance: "",
  });

  /* =========================
     LOAD FUNDS
  ========================= */
  const loadFunds = async () => {
    const res = await api.get("/funds");
    setFunds(res.data);
  };

  useEffect(() => {
    loadFunds();
  }, []);

  /* =========================
     ADD FUND
  ========================= */
  const addFund = async (e) => {
    e.preventDefault();

    if (!newFund.fund_name || !newFund.balance) {
      alert("All fields required");
      return;
    }

    await api.post("/funds", newFund);

    setNewFund({
      fund_name: "",
      fund_type: "MONTHLY",
      balance: "",
    });

    loadFunds();
  };

  /* =========================
     START EDIT
  ========================= */
  const startEdit = (fund) => {
    setEditingId(fund.id);
    setEditData({
      fund_name: fund.fund_name,
      fund_type: fund.fund_type,
      balance: fund.balance,
    });
  };

  /* =========================
     SAVE EDIT
  ========================= */
  const saveEdit = async (id) => {
    await api.put(`/funds/${id}`, editData);
    setEditingId(null);
    loadFunds();
  };

  /* =========================
     TOGGLE STATUS
  ========================= */
  const toggleFund = async (id) => {
    await api.patch(`/funds/${id}/toggle`);
    loadFunds();
  };

  /* =========================
     DELETE FUND
  ========================= */
  const deleteFund = async (id) => {
    const confirm = window.confirm(
      "Are you sure? This fund will be permanently deleted!"
    );
    if (!confirm) return;

    await api.delete(`/funds/${id}`);
    loadFunds();
  };

  return (
    <>
      <Navbar />

      <div style={container}>
        <div style={card}>
          <h2 style={title}>Fund Management</h2>

          {/* ➕ ADD FUND */}
          <form onSubmit={addFund} style={form}>
            <input
              placeholder="Fund Name"
              value={newFund.fund_name}
              onChange={(e) =>
                setNewFund({ ...newFund, fund_name: e.target.value })
              }
            />

            <select
              value={newFund.fund_type}
              onChange={(e) =>
                setNewFund({ ...newFund, fund_type: e.target.value })
              }
            >
              <option value="MONTHLY">MONTHLY</option>
              <option value="YEARLY">YEARLY</option>
              <option value="SPECIAL">SPECIAL</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={newFund.balance}
              onChange={(e) =>
                setNewFund({ ...newFund, balance: e.target.value })
              }
            />

            <button type="submit" style={primaryBtn}>
              Add Fund
            </button>
          </form>

          {/* 📋 FUND LIST */}
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Type</th>
                <th style={th}>Amount</th>
                <th style={th}>Total Collection</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {funds.map((f) => (
                <tr key={f.id}>
                  {/* NAME */}
                  <td style={td}>
                    {editingId === f.id ? (
                      <input
                        value={editData.fund_name}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            fund_name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      f.fund_name
                    )}
                  </td>

                  {/* TYPE */}
                  <td style={td}>
                    {editingId === f.id ? (
                      <select
                        value={editData.fund_type}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            fund_type: e.target.value,
                          })
                        }
                      >
                        <option value="MONTHLY">MONTHLY</option>
                        <option value="YEARLY">YEARLY</option>
                        <option value="SPECIAL">SPECIAL</option>
                      </select>
                    ) : (
                      f.fund_type
                    )}
                  </td>

                  {/* AMOUNT */}
                  <td style={td}>
                    {editingId === f.id ? (
                      <input
                        type="number"
                        value={editData.balance}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            balance: e.target.value,
                          })
                        }
                      />
                    ) : (
                      `₹${f.balance}`
                    )}
                  </td>

                  <td style={td}>₹{f.total_collection}</td>

                  {/* STATUS */}
                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 12,
                        fontSize: 12,
                        color: "#fff",
                        background:
                          f.status === "ACTIVE" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {f.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td style={td}>
                    {editingId === f.id ? (
                      <>
                        <button
                          style={editBtn}
                          onClick={() => saveEdit(f.id)}
                        >
                          Save
                        </button>
                        <button
                          style={{ ...editBtn, marginLeft: 6 }}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={editBtn}
                          onClick={() => startEdit(f)}
                        >
                          Edit
                        </button>

                        <button
                          style={{ ...editBtn, marginLeft: 6 }}
                          onClick={() => toggleFund(f.id)}
                        >
                          {f.status === "ACTIVE" ? "Disable" : "Enable"}
                        </button>

                        <button
                          style={{ ...dangerBtn, marginLeft: 6 }}
                          onClick={() => deleteFund(f.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ===== STYLES ===== */

const container = {
  padding: "40px",
  background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
  minHeight: "100vh",
};

const card = {
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(16px)",
  padding: "30px",
  borderRadius: "18px",
  boxShadow: "0 30px 60px rgba(0,0,0,.08)",
};

const title = {
  marginBottom: 25,
  fontSize: 28,
  fontWeight: 700,
  color: "#0f172a",
};

const form = {
  display: "flex",
  gap: 12,
  marginBottom: 25,
  background: "rgba(255,255,255,.7)",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,.05)",
};

const primaryBtn = {
  background: "linear-gradient(135deg,#2563eb,#1e40af)",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 999,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(37,99,235,.35)",
};

const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  borderRadius: 18,
  overflow: "hidden",
  background: "rgba(255,255,255,.8)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 25px 60px rgba(0,0,0,.1)",
};

const th = {
  background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
  color: "#fff",
  padding: 14,
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: ".05em",
};

const td = {
  padding: 14,
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
  color: "#0f172a",
};

const editBtn = {
  padding: "6px 14px",
  borderRadius: 999,
  border: "none",
  fontWeight: 600,
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(37,99,235,.35)",
};

const dangerBtn = {
  ...editBtn,
  background: "#dc2626",
  boxShadow: "0 6px 18px rgba(220,38,38,.35)",
};