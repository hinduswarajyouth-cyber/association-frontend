import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/audit-logs")
      .then((res) => {
        // safe handling (supports both {logs: []} or [])
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

        {loading && <p>Loading audit logs...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && logs.length === 0 && (
          <p>No audit logs found</p>
        )}

        {!loading && logs.length > 0 && (
          <table style={tableStyle}>
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
                    <b>{l.action}</b>
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
        )}
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  padding: "30px 40px",
  background: "#f1f5f9",
  minHeight: "100vh",
  fontFamily: "Inter, Segoe UI, sans-serif",
};

const title = {
  fontSize: "26px",
  fontWeight: 700,
  marginBottom: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  background: "#fff",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const metaStyle = {
  fontSize: "11px",
  background: "#f4f4f4",
  padding: "6px",
  borderRadius: "6px",
  maxWidth: "300px",
  whiteSpace: "pre-wrap",
};
