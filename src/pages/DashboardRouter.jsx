import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "SUPER_ADMIN":
    case "PRESIDENT":
      return <Navigate to="/president" replace />;

    case "TREASURER":
      return <Navigate to="/treasurer" replace />;

    case "MEMBER":
      return <Navigate to="/member" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
}
