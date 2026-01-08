import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* =========================
     LOAD AUDIT LOGS
  ========================= */
  useEffect(() => {
    api
      .get("/api/admin/audit-logs") // ✅ FINAL & CORRECT
      .then((res) => {
        setLogs(Array.isArray(res.data) ? res.data : []);
        setError("");
      })
      .catch((err) => {
        console.error("Audit logs error 👉", err);
        setError("Failed to load audit logs");
      })
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredLogs = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(q) ||
      l.entity?.toLowerCase().includes(q) ||
      l.performed_by?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Navbar />

      <div style={page}>
        <h1 style={title}>🛡 Audit Logs</h1>

        <input
          style={searchInput}
          placeholder="Search action / entity / user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p style={infoText}>Loading audit logs...</p>}
        {error && <p style={errorText}>{error}</p>}

        {!loading && !error && filteredLogs.length === 0 && (
          <p style={infoText}>No audit logs found</p>
        )}

        {!loading && filteredLogs.length > 0 && (
          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Performed By</th>
                  <th>Metadata</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((l) => (
                  <tr key={l.id}>
                    <td>{new Date(l.created_at).toLocaleString()}</td>

                    <td>
                      <span style={actionBadge(l.action)}>
                        {l.action}
                      </span>
                    </td>

                    <td>{l.entity || "-"}</td>
                    <td>{l.entity_id ?? "-"}</td>
                    <td>{l.performed_by || "System"}</td>

                    <td>
                      {l.metadata ? (
                        <pre style={metaStyle}>
                          {JSON.stringify(l.metadata, null, 2)}
                        </pre>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================
   🎨 STYLES
========================= */

const page = {
  padding: "28px 40px",
  background: "#f4f6fa",
  minHeight: "100vh",
};

const title = {
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 16,
};

const searchInput = {
  width: 320,
  padding: 10,
  marginBottom: 20,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const infoText = {
  color: "#475569",
  fontWeight: 500,
};

const errorText = {
  color: "#dc2626",
  fontWeight: 600,
};

const tableWrapper = {
  background: "#fff",
  borderRadius: 12,
  overflow: "auto",
  maxHeight: "72vh",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const actionBadge = (action = "") => ({
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 700,
  color: "#fff",
  background:
    action.includes("DELETE")
      ? "#dc2626"
      : action.includes("UPDATE")
      ? "#f59e0b"
      : action.includes("APPROVE")
      ? "#16a34a"
      : action.includes("LOGIN")
      ? "#0ea5e9"
      : "#475569",
});

const metaStyle = {
  fontSize: 11,
  background: "#f1f5f9",
  padding: 8,
  borderRadius: 6,
  maxWidth: 320,
  maxHeight: 120,
  overflow: "auto",
  whiteSpace: "pre-wrap",
};
