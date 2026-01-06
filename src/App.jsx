import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./PrivateRoute";

import Footer from "./components/Footer";
import InstallPWA from "./components/InstallPWA";
import OfflineBanner from "./components/OfflineBanner";
import UpdatePrompt from "./components/UpdatePrompt";

/* PUBLIC */
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

/* COMMON */
import Complaint from "./pages/Complaint";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Meetings from "./pages/Meetings";

/* DASHBOARDS */
import AdminDashboard from "./pages/AdminDashboard";
import TreasurerDashboard from "./pages/TreasurerDashboard";
import Dashboard from "./pages/Dashboard";

/* ADMIN */
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import Funds from "./pages/Funds";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";

/* MEMBER */
import MemberContributions from "./pages/MemberContributions";

/* =========================
   🔐 AUTH GATE (NO FLASH)
========================= */
function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center", fontSize: 18 }}>
        Loading application…
      </div>
    );
  }

  return children;
}

/* =========================
   ROLE BASED ROOT REDIRECT
========================= */
function RootRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "SUPER_ADMIN":
    case "PRESIDENT":
      return <Navigate to="/admin-dashboard" replace />;
    case "TREASURER":
      return <Navigate to="/treasurer-dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
}

export default function App() {
  return (
    <>
      <OfflineBanner />

      <AuthGate>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ROOT */}
          <Route path="/" element={<RootRedirect />} />

          {/* ADMIN */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRESIDENT"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/members"
            element={
              <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRESIDENT"]}>
                <Members />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-member"
            element={
              <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRESIDENT"]}>
                <AddMember />
              </PrivateRoute>
            }
          />

          <Route
            path="/funds"
            element={
              <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRESIDENT"]}>
                <Funds />
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "VICE_PRESIDENT",
                  "TREASURER",
                ]}
              >
                <Reports />
              </PrivateRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRESIDENT"]}>
                <AuditLogs />
              </PrivateRoute>
            }
          />

          {/* TREASURER */}
          <Route
            path="/treasurer-dashboard"
            element={
              <PrivateRoute allowedRoles={["TREASURER"]}>
                <TreasurerDashboard />
              </PrivateRoute>
            }
          />

          {/* MEMBER */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                allowedRoles={[
                  "MEMBER",
                  "EC_MEMBER",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "VOLUNTEER",
                ]}
              >
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/contributions"
            element={
              <PrivateRoute allowedRoles={["MEMBER"]}>
                <MemberContributions />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "MEMBER",
                ]}
              >
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "TREASURER", "PRESIDENT"]}>
                <Complaint />
              </PrivateRoute>
            }
          />

          <Route
            path="/meetings"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "TREASURER", "PRESIDENT"]}>
                <Meetings />
              </PrivateRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRESIDENT", "MEMBER"]}>
                <ChangePassword />
              </PrivateRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGate>

      <UpdatePrompt />
      <InstallPWA />
      <Footer />
    </>
  );
}
