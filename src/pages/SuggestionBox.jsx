import { useEffect, useState } from "react";
import api from "../services/api";

const SuggestionBox = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [success, setSuccess] = useState("");

  const role = localStorage.getItem("role");
  const isAdmin = role === "SUPER_ADMIN" || role === "PRESIDENT";

  /* =========================
     MEMBER – SUBMIT SUGGESTION
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
    } catch (err) {
      alert("Failed to submit suggestion");
    }
  };

  /* =========================
     ADMIN – LOAD SUGGESTIONS
  ========================= */
  const loadSuggestions = async () => {
    try {
      const res = await api.get("/suggestions"); // ✅ FIX
      setSuggestions(res.data);
    } catch (err) {
      console.error("LOAD SUGGESTIONS ERROR 👉", err);
    }
  };

  /* =========================
     ADMIN – UPDATE STATUS
     (OPTIONAL – ONLY IF BACKEND SUPPORTS)
  ========================= */
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/suggestions/${id}`, { status }); // ✅ FIX
      loadSuggestions();
    } catch (err) {
      console.error("UPDATE STATUS ERROR 👉", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadSuggestions();
    }
  }, [isAdmin]);

  return (
    <div className="container">
      <h2>💡 Suggestion Box</h2>

      {/* ================= MEMBER VIEW ================= */}
      {!isAdmin && (
        <>
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form onSubmit={submitSuggestion}>
            <label>Title (optional)</label>
            <input
              type="text"
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

          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Member</th>
                <th>Type</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {suggestions.map(s => (
                <tr key={s.id}>
                  <td>{s.member_name || "Anonymous"}</td>
                  <td>{s.type}</td>
                  <td>{s.message}</td>
                  <td>
                    <b>{s.status || "NEW"}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default SuggestionBox;
