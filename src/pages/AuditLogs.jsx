import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/audit-logs") // ✅ FINAL & CORRECT
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.logs)
          ? res.data.logs
          : [];

        setLogs(data);
      })
      .catch((err) => {
        console.error("Audit logs error:", err);
        setError("Failed to load audit logs");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <div style={page}>
        <h1 style={title}>Audit Logs</h1>

        {loading && <p style={infoText}>Loading audit logs...</p>}

        {error && <p style={errorText}>{error}</p>}

        {!loading && !error && logs.length === 0 && (
          <p style={infoText}>No audit logs found</p>
        )}

        {!loading && logs.length > 0 && (
          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>ID</th>
                  <th>Performed By</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((l, i) => (
                  <tr key={l.id || i}>
                    <td>{new Date(l.created_at).toLocaleString()}</td>

                    <td>
                      <span style={actionBadge(l.action)}>
                        {l.action}
                      </span>
                    </td>

                    <td>{l.entity || "-"}</td>
                    <td>{l.entity_id || "-"}</td>
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
   🎨 STYLES – ENTERPRISE
========================= */

const page = {
  padding: "28px 40px",
  background: "#f4f6fa",
  minHeight: "100vh",
  fontFamily: "Inter, Segoe UI, sans-serif",
};

const title = {
  fontSize: "26px",
  fontWeight: 700,
  marginBottom: "18px",
  color: "#0f172a",
};

const infoText = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#475569",
};

const errorText = {
  color: "#dc2626",
  fontWeight: 600,
};

const tableWrapper = {
  background: "#ffffff",
  borderRadius: "12px",
  overflow: "auto",
  maxHeight: "72vh",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const actionBadge = (action) => ({
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 700,
  color: "#fff",
  background:
    action?.includes("CREATE")
      ? "#16a34a"
      : action?.includes("EDIT")
      ? "#2563eb"
      : action?.includes("APPROVE")
      ? "#9333ea"
      : "#475569",
});

const metaStyle = {
  fontSize: "11px",
  background: "#f1f5f9",
  padding: "6px",
  borderRadius: "6px",
  maxWidth: "320px",
  whiteSpace: "pre-wrap",
  color: "#334155",
};
