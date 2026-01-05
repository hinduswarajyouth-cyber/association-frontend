export default function ResponsiveTable({ columns, data, renderCard }) {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((row, i) => (
          <div key={i} style={card}>
            {renderCard(row)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <table style={table}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((v, j) => (
              <td key={j}>{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const card = {
  background: "#fff",
  padding: 14,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
