import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
  const OFFICE_ROLES = [
    "VICE_PRESIDENT",
    "GENERAL_SECRETARY",
    "JOINT_SECRETARY",
    "EC_MEMBER",
  ];
  const MEMBER_ROLES = ["MEMBER", "VOLUNTEER"];

  return (
    <div style={bar}>
      <h3 style={logo}>Association System</h3>

      <div style={menu}>
        {/* ======================
            👑 ADMIN / PRESIDENT
        ====================== */}
        {ADMIN_ROLES.includes(role) && (
          <>
            <Link style={link} to="/admin-dashboard">Dashboard</Link>
            <Link style={link} to="/members">Members</Link>
            <Link style={link} to="/add-member">Add Member</Link>
            <Link style={link} to="/funds">Funds</Link>
            <Link style={link} to="/meetings">Meetings</Link>
            <Link style={link} to="/reports">Reports</Link>
            <Link style={link} to="/complaints">Complaints</Link>
          </>
        )}

        {/* ======================
            💰 TREASURER
        ====================== */}
        {role === "TREASURER" && (
          <>
            <Link style={link} to="/treasurer-dashboard">Dashboard</Link>
            <Link style={link} to="/meetings">Meetings</Link>
            <Link style={link} to="/reports">Reports</Link>
            <Link style={link} to="/complaints">Complaints</Link>
          </>
        )}

        {/* ======================
            🧑‍💼 OFFICE BEARERS
        ====================== */}
        {OFFICE_ROLES.includes(role) && (
          <>
            <Link style={link} to="/meetings">Meetings</Link>
            <Link style={link} to="/complaints">Complaints</Link>
          </>
        )}

        {/* ======================
            👤 MEMBER / VOLUNTEER
        ====================== */}
        {MEMBER_ROLES.includes(role) && (
          <>
            <Link style={link} to="/dashboard">Dashboard</Link>
            <Link style={link} to="/contributions">Contributions</Link>
            <Link style={link} to="/meetings">Meetings</Link>
            <Link style={link} to="/complaints">Complaints</Link>
            <Link style={link} to="/profile">Profile</Link>
          </>
        )}

        {/* ======================
            🔁 COMMON
        ====================== */}
        <Link style={link} to="/change-password">Change Password</Link>
        <button onClick={logout} style={logoutBtn}>Logout</button>
      </div>
    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */
const bar = {
  background: "#1e293b",
  padding: "14px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logo = {
  color: "#f8fafc",
  margin: 0,
  fontWeight: 700,
};

const menu = {
  display: "flex",
  gap: 18,
  alignItems: "center",
};

const link = {
  color: "#e5e7eb",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
};

const logoutBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};
