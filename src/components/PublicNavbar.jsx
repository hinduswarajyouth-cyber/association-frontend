import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <div style={bar}>
      <h3 style={logo}>Association System</h3>

      <div style={menu}>
        <Link style={link} to="/association">Home</Link>
        <Link style={link} to="/donate">Donate</Link>
        <Link style={loginBtn} to="/login">Login</Link>
      </div>
    </div>
  );
}

const bar = {
  background: "#1e293b",
  padding: "14px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logo = { color: "#fff", margin: 0 };
const menu = { display: "flex", gap: 16 };

const link = {
  color: "#e5e7eb",
  textDecoration: "none",
  fontWeight: 600,
};

const loginBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  textDecoration: "none",
};
