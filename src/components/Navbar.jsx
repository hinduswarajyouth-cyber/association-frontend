import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const role = user.role;
  const name = user.name || "User";

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
    if (ADMIN_ROLES.includes(role)) return "/dashboard";
    if (role === "TREASURER") return "/treasurer-dashboard";
    return "/dashboard";
  };

  /* =========================
     ACTIVE LINK STYLE
  ========================= */
  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? { ...link, ...activeLink }
      : link;

  const closeMenu = () => setOpen(false);

  const doLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div style={bar}>
        <h3 style={logo} onClick={() => navigate(getHomeRoute())}>
          Association System
        </h3>

        {/* 🍔 MOBILE TOGGLE */}
        <button style={burger} onClick={() => setOpen(!open)}>
          ☰
        </button>

        {/* ===== DESKTOP MENU ===== */}
        <div style={menuDesktop}>
          <MenuLinks role={role} isActive={isActive} onClick={closeMenu} />
          <UserInfo name={name} role={role} onLogout={doLogout} />
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {open && (
        <div style={menuMobile}>
          <MenuLinks role={role} isActive={isActive} onClick={closeMenu} />
          <UserInfo name={name} role={role} onLogout={doLogout} />
        </div>
      )}
    </>
  );
}

/* =========================
   MENU LINKS (FINAL)
========================= */
function MenuLinks({ role, isActive, onClick }) {
  const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
  const OFFICE_ROLES = [
    "VICE_PRESIDENT",
    "GENERAL_SECRETARY",
    "JOINT_SECRETARY",
    "EC_MEMBER",
  ];
  const MEMBER_ROLES = ["MEMBER", "VOLUNTEER"];

  return (
    <>
      {/* 👑 ADMIN / PRESIDENT */}
      {ADMIN_ROLES.includes(role) && (
        <>
          <Link onClick={onClick} style={isActive("/dashboard")} to="/dashboard">
            Dashboard
          </Link>

          <Link onClick={onClick} style={isActive("/association-info")} to="/association-info">
            Association Info
          </Link>

          <Link onClick={onClick} style={isActive("/members")} to="/members">
            Members
          </Link>
          <Link onClick={onClick} style={isActive("/funds")} to="/funds">
            Funds
          </Link>
          <Link onClick={onClick} style={isActive("/expenses")} to="/expenses">
            Expenses
          </Link>
          <Link onClick={onClick} style={isActive("/reports")} to="/reports">
            Reports
          </Link>
        </>
      )}

      {/* 💰 TREASURER */}
      {role === "TREASURER" && (
        <>
          <Link
            onClick={onClick}
            style={isActive("/treasurer-dashboard")}
            to="/treasurer-dashboard"
          >
            Dashboard
          </Link>
          <Link
            onClick={onClick}
            style={isActive("/treasurer/expense")}
            to="/treasurer/expense"
          >
            Create Expense
          </Link>
          <Link onClick={onClick} style={isActive("/reports")} to="/reports">
            Reports
          </Link>
        </>
      )}

      {/* 🧑‍💼 OFFICE */}
      {OFFICE_ROLES.includes(role) && (
        <Link onClick={onClick} style={isActive("/dashboard")} to="/dashboard">
          Dashboard
        </Link>
      )}

      {/* 👤 MEMBER */}
      {MEMBER_ROLES.includes(role) && (
        <>
          <Link onClick={onClick} style={isActive("/dashboard")} to="/dashboard">
            Dashboard
          </Link>
          <Link
            onClick={onClick}
            style={isActive("/contributions")}
            to="/contributions"
          >
            Contributions
          </Link>
        </>
      )}

      {/* 🔁 COMMON */}
      <Link onClick={onClick} style={isActive("/meetings")} to="/meetings">
        Meetings
      </Link>
      <Link onClick={onClick} style={isActive("/complaints")} to="/complaints">
        Complaints
      </Link>
      <Link onClick={onClick} style={isActive("/suggestions")} to="/suggestions">
        Suggestions
      </Link>
      <Link
        onClick={onClick}
        style={isActive("/change-password")}
        to="/change-password"
      >
        Change Password
      </Link>
    </>
  );
}

/* =========================
   USER INFO
========================= */
function UserInfo({ name, role, onLogout }) {
  return (
    <div style={userBox}>
      <span style={userName}>👤 {name}</span>
      <span style={roleBadge}>{role.replaceAll("_", " ")}</span>
      <button onClick={onLogout} style={logoutBtn}>
        Logout
      </button>
    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */
const bar = {
  background: "#1e293b",
  padding: "14px 20px",
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

const burger = {
  background: "transparent",
  color: "#fff",
  fontSize: 26,
  border: "none",
  cursor: "pointer",
  display: "none",
};

const menuDesktop = {
  display: "flex",
  gap: 16,
  alignItems: "center",
};

const menuMobile = {
  background: "#0f172a",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const link = {
  color: "#e5e7eb",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
};

const activeLink = {
  color: "#38bdf8",
  borderBottom: "2px solid #38bdf8",
};

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const userName = {
  color: "#e5e7eb",
  fontSize: 13,
};

const roleBadge = {
  background: "#2563eb",
  color: "#fff",
  padding: "2px 8px",
  borderRadius: 12,
  fontSize: 11,
};

const logoutBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
};
