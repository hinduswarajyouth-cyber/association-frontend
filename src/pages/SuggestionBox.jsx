import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

/* ================= META ================= */
const STATUS_META = {
  PENDING: { color: "#f59e0b", icon: "⏳" },
  APPROVED: { color: "#22c55e", icon: "✅" },
  REJECTED: { color: "#ef4444", icon: "❌" },
};

export default function SuggestionBox() {
  const { user } = useAuth();

  const isAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "PRESIDENT";

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    title: "",
    type: "GENERAL",
    message: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    if (user) loadSuggestions();
    // eslint-disable-next-line
  }, [user, isAdmin]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const res = isAdmin
        ? await api.get("/suggestions/all")
        : await api.get("/suggestions/my");

      setSuggestions(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const submitSuggestion = async () => {
    if (!form.message) return alert("Message required");

    await api.post("/suggestions", form);
    setSuccess("✅ Suggestion submitted");
    setForm({ title: "", type: "GENERAL", message: "" });
    loadSuggestions();

    setTimeout(() => setSuccess(""), 3000);
  };

  /* ================= ADMIN ACTION ================= */
  const updateStatus = async (id, status) => {
    await api.put(`/suggestions/${id}/status`, { status });
    loadSuggestions();
  };

  /* ================= DASHBOARD COUNTS ================= */
  const pending = suggestions.filter(s => s.status === "PENDING").length;
  const approved = suggestions.filter(s => s.status === "APPROVED").length;
  const rejected = suggestions.filter(s => s.status === "REJECTED").length;

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>💡 Suggestion Box</h2>
        <p style={{ color: "#64748b", marginBottom: 20 }}>
          Share ideas, improvements, or concerns with the association
        </p>

        {/* ===== DASHBOARD ===== */}
        <div style={dashGrid}>
          {[
            ["PENDING", pending],
            ["APPROVED", approved],
            ["REJECTED", rejected],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                ...dashCard,
                background: `linear-gradient(135deg, ${STATUS_META[k].color}, #00000020)`
              }}
            >
              <div style={{ fontSize: 32 }}>{STATUS_META[k].icon}</div>
              <div>
                <div style={{ fontSize: 13 }}>{k}</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== CREATE ===== */}
        {!isAdmin && (
          <div style={card}>
            <h3>Submit Suggestion</h3>

            {success && <p style={{ color: "green" }}>{success}</p>}

            <input
              style={input}
              placeholder="Title (optional)"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <select
              style={input}
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="GENERAL">General</option>
              <option value="IMPROVEMENT">Improvement</option>
              <option value="FINANCE">Finance</option>
              <option value="EVENT">Event</option>
            </select>

            <textarea
              style={textarea}
              placeholder="Your suggestion..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />

            <button style={btnPrimary} onClick={submitSuggestion}>
              Submit
            </button>
          </div>
        )}

        {/* ===== LIST ===== */}
        <h3 style={{ marginTop: 30 }}>
          {isAdmin ? "📬 All Suggestions" : "📝 My Suggestions"}
        </h3>

        {loading && <p>Loading...</p>}

        {!loading && suggestions.length === 0 && (
          <p style={{ color: "#64748b" }}>No suggestions yet.</p>
        )}

        {suggestions.map(s => (
          <div key={s.id} style={cardAnimated}>
            <div style={cardHeader}>
              <b>{s.title || "No Title"}</b>
              <span style={statusBadge(s.status)}>
                {STATUS_META[s.status].icon} {s.status}
              </span>
            </div>

            <p>{s.message}</p>

            <small style={{ color: "#64748b" }}>
              {s.member_name && <>By {s.member_name} • </>}
              {new Date(s.created_at).toLocaleString()}
            </small>

            {isAdmin && s.status === "PENDING" && (
              <div style={actionRow}>
                <button
                  style={btnSuccess}
                  onClick={() => updateStatus(s.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  style={btnDanger}
                  onClick={() => updateStatus(s.id, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 30,
  background: "#f1f5f9",
  minHeight: "100vh",
};

const dashGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
  gap: 20,
  marginBottom: 30,
};

const dashCard = {
  color: "#fff",
  padding: 20,
  borderRadius: 18,
  display: "flex",
  gap: 16,
  alignItems: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,.15)",
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 18,
  marginBottom: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
};

const cardAnimated = {
  ...card,
  transition: "transform .25s, box-shadow .25s",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statusBadge = status => ({
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  color: "#fff",
  background: STATUS_META[status]?.color,
});

const actionRow = {
  display: "flex",
  gap: 10,
  marginTop: 12,
};

const input = {
  width: "100%",
  maxWidth: 360,
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const textarea = {
  width: "100%",
  maxWidth: 360,
  height: 90,
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
};

const btnSuccess = {
  background: "#16a34a",
  color: "#fff",
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
};

const btnDanger = {
  background: "#dc2626",
  color: "#fff",
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
};
