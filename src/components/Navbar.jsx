import { Link, useNavigate, useLocation } from "react-router-dom";

/* =========================
   🔐 GET USER FROM JWT
========================= */
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();

  /* =========================
     🔒 SAFETY: INVALID TOKEN
  ========================= */
  if (!user) {
    localStorage.clear();
    navigate("/", { replace: true });
    return null;
  }

  const role = user.role;
  const name = user.name || "User";

  /* =========================
     🔓 LOGOUT
  ========================= */
  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  /* =========================
     ROLE GROUPS
  ========================= */
  const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
  const OFFICE_ROLES = [
    "VICE_PRESIDENT",
    "GENERAL_SECRETARY",
    "JOINT_SECRETARY",
    "EC_MEMBER",
  ];
  const MEMBER_ROLES = ["MEMBER", "VOLUNTEER"];

  /* =========================
     HOME ROUTE
  ========================= */
  const getHomeRoute = () => {
    if (ADMIN_ROLES.includes(role)) return "/admin-dashboard";
    if (role === "TREASURER") return "/treasurer-dashboard";
    return "/dashboard";
  };

  /* =========================
     ROLE COLOR
  ========================= */
  const getRoleColor = () => {
    if (ADMIN_ROLES.includes(role)) return "#16a34a";
    if (OFFICE_ROLES.includes(role)) return "#7c3aed";
    return "#2563eb";
  };

  /* =========================
     ACTIVE LINK STYLE
  ========================= */
  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? { ...link, ...activeLink }
      : link;

  return (
    <div style={bar}>
      {/* 🏠 LOGO */}
      <h3 style={logo} onClick={() => navigate(getHomeRoute())}>
        Association System
      </h3>

      {/* 📌 MENU */}
      <div style={menu}>
        {/* 👑 ADMIN */}
        {ADMIN_ROLES.includes(role) && (
          <>
            <Link style={isActive("/admin-dashboard")} to="/admin-dashboard">Dashboard</Link>
            <Link style={isActive("/members")} to="/members">Members</Link>
            <Link style={isActive("/add-member")} to="/add-member">Add Member</Link>
            <Link style={isActive("/funds")} to="/funds">Funds</Link>
            <Link style={isActive("/meetings")} to="/meetings">Meetings</Link>
            <Link style={isActive("/reports")} to="/reports">Reports</Link>
            <Link style={isActive("/complaints")} to="/complaints">Complaints</Link>
          </>
        )}

        {/* 💰 TREASURER */}
        {role === "TREASURER" && (
          <>
            <Link style={isActive("/treasurer-dashboard")} to="/treasurer-dashboard">Dashboard</Link>
            <Link style={isActive("/meetings")} to="/meetings">Meetings</Link>
            <Link style={isActive("/reports")} to="/reports">Reports</Link>
            <Link style={isActive("/complaints")} to="/complaints">Complaints</Link>
          </>
        )}

        {/* 🧑‍💼 OFFICE */}
        {OFFICE_ROLES.includes(role) && (
          <>
            <Link style={isActive("/meetings")} to="/meetings">Meetings</Link>
            <Link style={isActive("/complaints")} to="/complaints">Complaints</Link>
          </>
        )}

        {/* 👤 MEMBER */}
        {MEMBER_ROLES.includes(role) && (
          <>
            <Link style={isActive("/dashboard")} to="/dashboard">Dashboard</Link>
            <Link style={isActive("/contributions")} to="/contributions">Contributions</Link>
            <Link style={isActive("/meetings")} to="/meetings">Meetings</Link>
            <Link style={isActive("/complaints")} to="/complaints">Complaints</Link>
            <Link style={isActive("/profile")} to="/profile">Profile</Link>
          </>
        )}

        {/* 🔁 COMMON */}
        <Link style={isActive("/change-password")} to="/change-password">
          Change Password
        </Link>

        {/* 👤 USER INFO */}
        <div style={userBox}>
          <span style={userName}>👤 {name}</span>
          <span style={{ ...roleBadge, background: getRoleColor() }}>
            {role.replace("_", " ")}
          </span>
        </div>

        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
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
  fontWeight: 800,
  cursor: "pointer",
};

const menu = {
  display: "flex",
  gap: 16,
  alignItems: "center",
};

const link = {
  color: "#e5e7eb",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
  padding: "4px 6px",
};

const activeLink = {
  color: "#38bdf8",
  borderBottom: "2px solid #38bdf8",
};

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const userName = {
  color: "#e5e7eb",
  fontSize: 13,
  fontWeight: 600,
};

const roleBadge = {
  color: "#fff",
  padding: "2px 8px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 700,
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
