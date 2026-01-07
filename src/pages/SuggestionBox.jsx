import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function SuggestionBox() {
  const { user } = useAuth();

  const isAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "PRESIDENT";

  const [form, setForm] = useState({
    title: "",
    type: "GENERAL",
    message: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  /* =========================
     LOAD SUGGESTIONS
  ========================= */
  useEffect(() => {
    if (user) {
      loadSuggestions();
    }
    // eslint-disable-next-line
  }, [user, isAdmin]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const res = isAdmin
        ? await api.get("/api/suggestions/all")
        : await api.get("/api/suggestions/my");

      setSuggestions(res.data || []);
    } catch (err) {
      console.error("LOAD SUGGESTIONS ERROR 👉", err);
      alert("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUBMIT SUGGESTION
  ========================= */
  const submitSuggestion = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!form.message) {
      alert("Message required");
      return;
    }

    try {
      await api.post("/api/suggestions", form);
      setSuccess("✅ Suggestion submitted successfully");
      setForm({ title: "", type: "GENERAL", message: "" });
      loadSuggestions();
    } catch (err) {
      console.error("SUBMIT ERROR 👉", err);
      alert("Failed to submit suggestion");
    }
  };

  /* =========================
     ADMIN APPROVE / REJECT
  ========================= */
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/suggestions/${id}/status`, { status });
      loadSuggestions();
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2>💡 Suggestion Box</h2>

        {/* ================= CREATE (ALL USERS) ================= */}
        {!isAdmin && (
          <div style={card}>
            <h3>Submit Suggestion</h3>

            {success && (
              <p style={{ color: "green", marginBottom: 10 }}>
                {success}
              </p>
            )}

            <input
              style={input}
              placeholder="Title (optional)"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <select
              style={input}
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
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
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <button style={btnPrimary} onClick={submitSuggestion}>
              Submit
            </button>
          </div>
        )}

        {/* ================= LIST ================= */}
        <h3 style={{ marginTop: 20 }}>
          {isAdmin ? "📬 All Suggestions" : "📝 My Suggestions"}
        </h3>

        {loading && <p>Loading suggestions...</p>}
        {!loading && suggestions.length === 0 && (
          <p>No suggestions found</p>
        )}

        {suggestions.map((s) => (
          <div key={s.id} style={card}>
            <div style={cardHeader}>
              <strong>{s.title || "No Title"}</strong>
              <span
                style={{
                  ...badge,
                  background:
                    s.status === "APPROVED"
                      ? "#86efac"
                      : s.status === "REJECTED"
                      ? "#fca5a5"
                      : "#fde68a",
                }}
              >
                {s.status}
              </span>
            </div>

            <p>{s.message}</p>

            <small style={{ color: "#64748b" }}>
              {s.member_name && <>By {s.member_name} • </>}
              {new Date(s.created_at).toLocaleString()}
            </small>

            {/* ADMIN ACTIONS */}
            {isAdmin && s.status === "PENDING" && (
              <div style={actionRow}>
                <button
                  style={btnSuccess}
                  onClick={() =>
                    updateStatus(s.id, "APPROVED")
                  }
                >
                  Approve
                </button>
                <button
                  style={btnDanger}
                  onClick={() =>
                    updateStatus(s.id, "REJECTED")
                  }
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

/* =========================
   🎨 STYLES
========================= */
const page = {
  padding: 30,
  background: "#f1f5f9",
  minHeight: "100vh",
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 12,
  marginBottom: 16,
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const badge = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
};

const actionRow = {
  display: "flex",
  gap: 10,
  marginTop: 12,
};

const input = {
  width: "100%",
  maxWidth: 360,
  padding: 8,
  marginBottom: 10,
};

const textarea = {
  width: "100%",
  maxWidth: 360,
  height: 90,
  padding: 8,
  marginBottom: 10,
};

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnSuccess = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const btnDanger = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
};
