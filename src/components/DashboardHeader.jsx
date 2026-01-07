import { useAuth } from "../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  if (!user) return null;

  const roleText = {
    SUPER_ADMIN: "Admin Dashboard",
    PRESIDENT: "President Dashboard",
    TREASURER: "Treasurer Dashboard",
    EC_MEMBER: "EC Member Dashboard (Read Only)",
    JOINT_SECRETARY: "Joint Secretary Dashboard",
    VICE_PRESIDENT: "Vice President Dashboard",
    GENERAL_SECRETARY: "General Secretary Dashboard",
    MEMBER: "Member Dashboard",
  };

  return (
    <div style={box}>
      <h2>
        Welcome, <span style={{ color: "#2563eb" }}>{user.name}</span> 👋
      </h2>
      <p style={{ marginTop: 6, color: "#64748b" }}>
        {roleText[user.role] || "Dashboard"}
      </p>
    </div>
  );
}

const box = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};
