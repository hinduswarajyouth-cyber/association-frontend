import { useAuth } from "../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const roleMap = {
    SUPER_ADMIN: "Super Admin",
    PRESIDENT: "President",
    VICE_PRESIDENT: "Vice President",
    GENERAL_SECRETARY: "General Secretary",
    JOINT_SECRETARY: "Joint Secretary",
    TREASURER: "Treasurer",
    EC_MEMBER: "EC Member",
    MEMBER: "Member",
  };

  return (
    <div style={box}>
      <h2 style={{ margin: 0 }}>
        Welcome, {user?.name} 👋
      </h2>
      <p style={{ marginTop: 4, color: "#64748b" }}>
        {roleMap[user?.role]} Dashboard
      </p>
    </div>
  );
}

const box = {
  background: "#ffffff",
  padding: "16px 20px",
  borderRadius: 12,
  marginBottom: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};
