import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

/* ===== PUBLIC ===== */
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

/* ===== COMMON ===== */
import Complaint from "./pages/Complaint";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Meetings from "./pages/Meetings";

/* ===== DASHBOARDS ===== */
import AdminDashboard from "./pages/AdminDashboard";
import TreasurerDashboard from "./pages/TreasurerDashboard";
import Dashboard from "./pages/Dashboard";

/* ===== ADMIN ===== */
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import Funds from "./pages/Funds";
import Reports from "./pages/Reports";

/* ===== MEMBER ===== */
import MemberContributions from "./pages/MemberContributions";

export default function App() {
  return (
    <Routes>
      {/* 🔓 PUBLIC */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 🧩 COMPLAINTS – ALL LOGGED USERS */}
      <Route
        path="/complaints"
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
              "VOLUNTEER",
            ]}
          >
            <Complaint />
          </PrivateRoute>
        }
      />

      {/* 📅 MEETINGS – ALL LOGGED USERS */}
      <Route
        path="/meetings"
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
              "VOLUNTEER",
            ]}
          >
            <Meetings />
          </PrivateRoute>
        }
      />

      {/* 🔁 CHANGE PASSWORD */}
      <Route
        path="/change-password"
        element={
          <PrivateRoute
            allowedRoles={[
              "SUPER_ADMIN",
              "PRESIDENT",
              "VICE_PRESIDENT",
              "TREASURER",
              "MEMBER",
              "VOLUNTEER",
            ]}
          >
            <ChangePassword />
          </PrivateRoute>
        }
      />

      {/* 👑 ADMIN / PRESIDENT */}
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

      {/* 📊 REPORTS */}
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

      {/* 💰 TREASURER */}
      <Route
        path="/treasurer-dashboard"
        element={
          <PrivateRoute allowedRoles={["TREASURER", "PRESIDENT"]}>
            <TreasurerDashboard />
          </PrivateRoute>
        }
      />

      {/* 🧭 SINGLE DASHBOARD (MULTI-ROLE) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            allowedRoles={[
              "EC_MEMBER",
              "GENERAL_SECRETARY",
              "JOINT_SECRETARY",
              "MEMBER",
              "VOLUNTEER",
              "VICE_PRESIDENT",
            ]}
          >
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* 👤 MEMBER CONTRIBUTIONS */}
      <Route
        path="/contributions"
        element={
          <PrivateRoute allowedRoles={["MEMBER"]}>
            <MemberContributions />
          </PrivateRoute>
        }
      />

      {/* 👤 PROFILE */}
      <Route
        path="/profile"
        element={
          <PrivateRoute
            allowedRoles={[
              "SUPER_ADMIN",
              "PRESIDENT",
              "VICE_PRESIDENT",
              "TREASURER",
              "MEMBER",
              "VOLUNTEER",
            ]}
          >
            <Profile />
          </PrivateRoute>
        }
      />

      {/* 🚫 FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
