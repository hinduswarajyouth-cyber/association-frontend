import { useState } from "react";
import api from "../api/api";

export default function SuggestionForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!message) return alert("Message required");

    try {
      setLoading(true);
      await api.post("/members/suggestions", { title, message });
      setTitle("");
      setMessage("");
      onSuccess && onSuccess();
      alert("Suggestion submitted ✅");
    } catch {
      alert("Failed to submit suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={box}>
      <h4>💡 Submit Suggestion</h4>

      <input
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={input}
      />

      <textarea
        placeholder="Your suggestion"
        rows="3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        style={input}
      />

      <button disabled={loading} style={btn}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

const box = {
  background: "#fff",
  padding: 15,
  borderRadius: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  marginTop: 15,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
};

const btn = {
  background: "#2563eb",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
