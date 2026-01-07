import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* =========================
   ROLE GROUPS
========================= */
const ADMIN_ROLES = ["SUPER_ADMIN", "PRESIDENT"];
const TREASURER_ROLES = ["TREASURER"];
const MEMBER_ROLES = [
  "EC_MEMBER",
  "GENERAL_SECRETARY",
  "JOINT_SECRETARY",
  "VICE_PRESIDENT",
  "MEMBER",
  "VOLUNTEER",
];

export default function PrivateRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  /* =========================
     WAIT FOR AUTH CHECK
  ========================= */
  if (loading) {
    return null; // ⛔ no flicker, no redirect
  }

  /* =========================
     NOT LOGGED IN
  ========================= */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* =========================
     ROLE NOT ALLOWED
     ❗ REDIRECT TO OWN DASHBOARD
  ========================= */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // 🔑 ADMIN
    if (ADMIN_ROLES.includes(user.role)) {
      return <Navigate to="/admin-dashboard" replace />;
    }

    // 💰 TREASURER
    if (TREASURER_ROLES.includes(user.role)) {
      return <Navigate to="/treasurer-dashboard" replace />;
    }

    // 👥 MEMBER / EC / VOLUNTEER
    if (MEMBER_ROLES.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    // 🚫 FALLBACK (SAFETY)
    return <Navigate to="/login" replace />;
  }

  /* =========================
     AUTHORIZED
  ========================= */
  return children;
}
