import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationPanel({ onClose }) {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <div style={panel}>
      <h4 style={title}>Notifications</h4>

      {notifications.length === 0 && (
        <p style={empty}>No notifications</p>
      )}

      {notifications.map(n => (
        <div
          key={n.id}
          style={{
            ...item,
            background: n.is_read ? "#0f172a" : "#1e293b",
          }}
          onClick={() => {
            markAsRead(n.id);
            navigate(n.link);
            onClose();
          }}
        >
          <b>{n.title}</b>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

const panel = {
  position: "absolute",
  top: 60,
  right: 20,
  width: 320,
  background: "#020617",
  borderRadius: 8,
  padding: 12,
  boxShadow: "0 10px 40px rgba(0,0,0,.5)",
  zIndex: 1000,
};

const title = {
  margin: "0 0 10px",
  color: "#fff",
};

const item = {
  padding: 10,
  borderRadius: 6,
  cursor: "pointer",
  marginBottom: 6,
  color: "#e5e7eb",
};

const empty = {
  color: "#94a3b8",
};
