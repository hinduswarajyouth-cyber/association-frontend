export default function Footer() {
  return (
    <footer style={footer}>
      © {new Date().getFullYear()} Hinduswaraj Youth Welfare Association ·{" "}
      <span style={brand}>Developed by Sreetech Technologies, Jagtial</span>
    </footer>
  );
}

/* =========================
   🎨 STYLES
========================= */
const footer = {
  width: "100%",
  marginTop: 40,
  padding: "14px 0",
  textAlign: "center",
  fontSize: 12,
  color: "#64748b",
  background: "#f8fafc",
  borderTop: "1px solid #e5e7eb",
};

const brand = {
  fontWeight: 600,
  color: "#2563eb",
};
