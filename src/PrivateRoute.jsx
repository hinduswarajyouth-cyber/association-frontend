import { Navigate } from "react-router-dom";

/* ✅ COMMON DASHBOARD ROLES */
const dashboardRoles = [
  "EC_MEMBER",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
  "MEMBER",
  "VOLUNTEER",
  "VICE_PRESIDENT",
];

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 NOT LOGGED IN → LOGIN
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ⛔ LOGGED IN BUT ROLE NOT ALLOWED
  if (allowedRoles && !allowedRoles.includes(role)) {
    // 🔁 ADMIN ROLES
    if (["SUPER_ADMIN", "ADMIN", "PRESIDENT"].includes(role)) {
      return <Navigate to="/admin-dashboard" replace />;
    }

    // 💰 TREASURER
    if (role === "TREASURER") {
      return <Navigate to="/treasurer-dashboard" replace />;
    }

    // 👥 COMMON DASHBOARD USERS
    if (dashboardRoles.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }

    // 🚫 UNKNOWN ROLE → LOGOUT
    return <Navigate to="/" replace />;
  }

  // ✅ AUTHORIZED
  return children;
}
