import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const SuggestionBox = () => {
  const { user } = useAuth();

  const isAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "PRESIDENT";

  const [title, setTitle] = useState("");
  const [type, setType] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  /* =========================
     SUBMIT (ALL USERS)
  ========================= */
  const submitSuggestion = async e => {
    e.preventDefault();
    setSuccess("");

    try {
      await api.post("/suggestions", {
        title,
        type,
        message,
      });

      setSuccess("✅ Suggestion submitted successfully");
      setTitle("");
      setMessage("");
      setType("GENERAL");
    } catch {
      alert("Failed to submit suggestion");
    }
  };

  /* =========================
     LOAD ALL (ADMIN ONLY)
  ========================= */
  const loadSuggestions = async () => {
    try {
      const res = await api.get("/suggestions");
      setSuggestions(res.data);
    } catch (err) {
      console.error("LOAD SUGGESTIONS ERROR 👉", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadSuggestions();
    }
  }, [isAdmin]);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h2>💡 Suggestion Box</h2>

      {/* ================= MEMBER VIEW ================= */}
      {!isAdmin && (
        <>
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form onSubmit={submitSuggestion}>
            <label>Title (optional)</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <label>Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="GENERAL">General</option>
              <option value="COMPLAINT">Complaint</option>
              <option value="FINANCE">Finance</option>
              <option value="EVENT">Event</option>
              <option value="IMPROVEMENT">Improvement</option>
            </select>

            <label>Message *</label>
            <textarea
              rows="5"
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            <button type="submit">Submit</button>
          </form>
        </>
      )}

      {/* ================= ADMIN VIEW ================= */}
      {isAdmin && (
        <>
          <h3>📬 All Suggestions</h3>

          {suggestions.length === 0 ? (
            <p>No suggestions yet</p>
          ) : (
            <table width="100%" border="1">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map(s => (
                  <tr key={s.id}>
                    <td>{s.member_name}</td>
                    <td>{s.title || "-"}</td>
                    <td>{s.type}</td>
                    <td>{s.message}</td>
                    <td>
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default SuggestionBox;
