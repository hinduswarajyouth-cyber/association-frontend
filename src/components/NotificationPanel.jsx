import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationPanel({ onClose }) {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <div style={panel}>
      {/* HEADER */}
      <div style={header}>
        <h4 style={title}>🔔 Notifications</h4>
        <button style={closeBtn} onClick={onClose}>✕</button>
      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 && (
        <div style={emptyWrap}>
          <span style={{ fontSize: 28 }}>📭</span>
          <p style={empty}>No notifications</p>
        </div>
      )}

      {/* LIST */}
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            ...item,
            background: n.is_read
              ? "#020617"
              : "linear-gradient(135deg,#1e293b,#0f172a)",
            borderLeft: n.is_read
              ? "3px solid transparent"
              : "3px solid #22c55e",
          }}
          onClick={(e) => {
            e.stopPropagation();          // ✅ SAFETY FIX
            markAsRead(n.id);             // ✅ MARK READ
            if (n.link) navigate(n.link); // ✅ SAFE NAVIGATION
            onClose();                    // ✅ CLOSE PANEL
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(0,0,0,.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={itemHeader}>
            <b style={{ color: "#fff" }}>{n.title}</b>
            {!n.is_read && <span style={dot} />}
          </div>

          <p style={msg}>{n.message}</p>

          <small style={time}>
            {new Date(n.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

/* ===================== STYLES ===================== */

const panel = {
  position: "absolute",
  top: 60,
  right: 20,
  width: 340,
  maxHeight: 420,
  overflowY: "auto",
  background: "#020617",
  borderRadius: 14,
  padding: 12,
  boxShadow: "0 20px 50px rgba(0,0,0,.6)",
  zIndex: 1000,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const title = {
  margin: 0,
  color: "#e5e7eb",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  color: "#94a3b8",
  fontSize: 16,
  cursor: "pointer",
};

const item = {
  padding: 12,
  borderRadius: 10,
  cursor: "pointer",
  marginBottom: 8,
  transition: "transform .15s, box-shadow .15s",
};

const itemHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const msg = {
  margin: "4px 0",
  color: "#cbd5f5",
  fontSize: 13,
};

const time = {
  color: "#64748b",
  fontSize: 11,
};

const dot = {
  width: 8,
  height: 8,
  background: "#22c55e",
  borderRadius: "50%",
};

const emptyWrap = {
  textAlign: "center",
  padding: 30,
};

const empty = {
  color: "#94a3b8",
  marginTop: 6,
};
