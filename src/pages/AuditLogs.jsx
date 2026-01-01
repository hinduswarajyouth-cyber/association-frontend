import { useEffect, useState } from "react";
import api from "../api/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/admin/audit-logs")
      .then(res => setLogs(res.data.logs))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Audit Logs</h1>

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
            <tr key={i}>
              <td>{new Date(l.created_at).toLocaleString()}</td>
              <td><b>{l.action}</b></td>
              <td>{l.entity}</td>
              <td>{l.entity_id}</td>
              <td>{l.performed_by || "System"}</td>
              <td>
                {l.metadata
                  ? <pre style={metaStyle}>{JSON.stringify(l.metadata, null, 2)}</pre>
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px"
};

const metaStyle = {
  fontSize: "11px",
  background: "#f4f4f4",
  padding: "6px",
  borderRadius: "6px"
};
