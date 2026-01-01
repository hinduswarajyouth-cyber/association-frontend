export default function ReportTable({ title, columns = [], data = [] }) {
  return (
    <div style={box}>
      {title && <h3 style={titleStyle}>{title}</h3>}

      {data.length === 0 ? (
        <p style={noData}>No data available</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} style={th}>
                  {c.replace("_", " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={i % 2 ? rowAlt : null}>
                {columns.map((c) => (
                  <td key={c} style={td}>
                    {c.toLowerCase().includes("amount")
                      ? `₹${Number(row[c] || 0).toLocaleString()}`
                      : row[c] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* =========================
   🎨 STYLES (INLINE)
========================= */

const box = {
  marginTop: 20,
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const titleStyle = {
  marginBottom: 12,
  fontSize: 18,
  fontWeight: 600,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#334155",
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 13,
};

const rowAlt = {
  background: "#f9fafb",
};

const noData = {
  fontSize: 13,
  color: "#64748b",
};
