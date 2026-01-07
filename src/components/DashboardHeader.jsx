import { useAuth } from "../context/AuthContext";

export default function DashboardHeader({ subtitle }) {
  const { user } = useAuth();

  return (
    <div style={box}>
      <h2>
        Welcome, <span style={name}>{user?.name}</span> 👋
      </h2>
      <p style={sub}>{subtitle}</p>
    </div>
  );
}

const box = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 14,
  marginBottom: 25,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const name = {
  color: "#2563eb",
};

const sub = {
  color: "#64748b",
  marginTop: 6,
};
