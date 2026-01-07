import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import TreasurerDashboard from "./TreasurerDashboard";
import MemberDashboard from "./MemberDashboard";
import ECDashboard from "./ECDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "SUPER_ADMIN":
    case "PRESIDENT":
      return <AdminDashboard />;

    case "TREASURER":
      return <TreasurerDashboard />;

    case "VICE_PRESIDENT":
    case "GENERAL_SECRETARY":
    case "JOINT_SECRETARY":
    case "EC_MEMBER":
      return <ECDashboard />;

    default:
      return <MemberDashboard />;
  }
}
