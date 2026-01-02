export default function Footer() {
  return (
    <footer style={footerStyle}>
      © {new Date().getFullYear()} · Developed by{" "}
      <span style={brand}>Sreetech Technologies, Jagtial</span>
    </footer>
  );
}

const footerStyle = {
  width: "100%",
  padding: "14px 0",
  textAlign: "center",
  fontSize: "12px",
  color: "#64748b",
  background: "transparent",
};

const brand = {
  fontWeight: 600,
  color: "#0f172a",
};
