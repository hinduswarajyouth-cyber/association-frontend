import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  /* ================= LOAD ================= */
  const loadNotifications = async () => {
    if (!user) return;

    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.warn("Notifications load skipped");
    }
  };

  /* ================= MARK AS READ ================= */
  const markAsRead = async (id) => {
  try {
    // optimistic UI update
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );

    // correct API
    await api.post(`/notifications/read/${id}`);
  } catch (err) {
    console.warn("Failed to mark notification read");
  }
};
const markAllAsRead = async () => {
  try {
    await api.post("/notifications/read-all");
    setNotifications(n => n.map(x => ({ ...x, is_read: true })));
  } catch {
    console.warn("Failed to mark all");
  }
};
  /* ================= EFFECT ================= */
  useEffect(() => {
    if (user && !loaded) {
      loadNotifications();
      setLoaded(true);
    }

    if (!user) {
      setNotifications([]);
      setLoaded(false);
    }
  }, [user]);

  return (
    <NotificationContext.Provider
  value={{
    notifications,
    reloadNotifications: loadNotifications,
    markAsRead,
    markAllAsRead,
  }}
>

      {children}
    </NotificationContext.Provider>
  );
}

/* ================= HOOK ================= */
export const useNotifications = () => {
  return useContext(NotificationContext);
};
