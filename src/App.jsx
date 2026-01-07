import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Footer from "./components/Footer";

/* PUBLIC */
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

/* COMMON */
import Complaint from "./pages/Complaint";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Meetings from "./pages/Meetings";

/* DASHBOARD (SINGLE) */
import Dashboard from "./pages/Dashboard";

/* ADMIN */
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import Funds from "./pages/Funds";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";

/* CONTRIBUTIONS */
import MemberContributions from "./pages/MemberContributions";

/* EXTRA */
import Announcements from "./pages/Announcements";
import SuggestionBox from "./pages/SuggestionBox";

/* =========================
   AUTH GATE
========================= */
function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 60 }}>Loading…</div>;
  }

  return children;
}

export default function App() {
  return (
    <>
      <AuthGate>
        <Routes>
          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* =========================
              ✅ SINGLE DASHBOARD (ALL ROLES)
          ========================= */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "EC_MEMBER",
                  "TREASURER",
                  "MEMBER",
                ]}
              >
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* ADMIN ONLY */}
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
                allowedRoles={["SUPER_ADMIN", "PRESIDENT", "TREASURER"]}
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

          {/* CONTRIBUTIONS – ALL ROLES */}
          <Route
            path="/contributions"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "EC_MEMBER",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "MEMBER",
                  "VOLUNTEER",
                ]}
              >
                <MemberContributions />
              </PrivateRoute>
            }
          />

          {/* ANNOUNCEMENTS */}
          <Route
            path="/announcements"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "EC_MEMBER",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "MEMBER",
                  "VOLUNTEER",
                ]}
              >
                <Announcements />
              </PrivateRoute>
            }
          />

          {/* SUGGESTIONS */}
          <Route
            path="/suggestions"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "EC_MEMBER",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "MEMBER",
                  "VOLUNTEER",
                ]}
              >
                <SuggestionBox />
              </PrivateRoute>
            }
          />

          {/* COMPLAINTS */}
          <Route
            path="/complaints"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "EC_MEMBER",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "MEMBER",
                ]}
              >
                <Complaint />
              </PrivateRoute>
            }
          />

          {/* MEETINGS */}
          <Route
            path="/meetings"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "EC_MEMBER",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "MEMBER",
                  "VOLUNTEER",
                ]}
              >
                <Meetings />
              </PrivateRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "MEMBER",
                  "VOLUNTEER",
                ]}
              >
                <Profile />
              </PrivateRoute>
            }
          />

          {/* CHANGE PASSWORD */}
          <Route
            path="/change-password"
            element={
              <PrivateRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "PRESIDENT",
                  "TREASURER",
                  "EC_MEMBER",
                  "VICE_PRESIDENT",
                  "GENERAL_SECRETARY",
                  "JOINT_SECRETARY",
                  "MEMBER",
                  "VOLUNTEER",
                ]}
              >
                <ChangePassword />
              </PrivateRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthGate>

      <Footer />
    </>
  );
}
