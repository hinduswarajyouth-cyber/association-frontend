import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  /* =========================
     WAIT FOR AUTH
  ========================= */
  if (loading) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  /* =========================
     NOT LOGGED IN
  ========================= */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* =========================
     ROLE NOT ALLOWED
  ========================= */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // 🔁 ADMIN
    if (ADMIN_ROLES.includes(user.role)) {
      return <Navigate to="/president" replace />;
    }

    // 💰 TREASURER
    if (TREASURER_ROLES.includes(user.role)) {
      return <Navigate to="/treasurer" replace />;
    }

    // 👥 MEMBER / EC
    if (MEMBER_ROLES.includes(user.role)) {
      return <Navigate to="/member" replace />;
    }

    // 🚫 UNKNOWN ROLE
    return <Navigate to="/login" replace />;
  }

  /* =========================
     AUTHORIZED
  ========================= */
  return children;
}
