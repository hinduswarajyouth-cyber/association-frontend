import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // normalize role once
  const role = user.role?.replaceAll(" ", "_");

  switch (role) {
    case "SUPER_ADMIN":
    case "PRESIDENT":
    case "VICE_PRESIDENT":
    case "GENERAL_SECRETARY":
    case "JOINT_SECRETARY":
    case "EC_MEMBER":
      return <Navigate to="/dashboard" replace />;

    case "TREASURER":
      return <Navigate to="/treasurer-dashboard" replace />;

    case "MEMBER":
      return <Navigate to="/dashboard" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
}
