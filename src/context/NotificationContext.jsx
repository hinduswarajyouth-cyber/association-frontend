import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth(); // ✅ check login
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadNotifications = async () => {
    // 🔒 Do not call API if not logged in
    if (!user) return;

    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      // ❌ Do nothing on error (axios handles redirect)
      console.warn("Notifications skipped");
    }
  };

  useEffect(() => {
    if (user && !loaded) {
      loadNotifications();
      setLoaded(true);
    }

    if (!user) {
      // logout / session expired
      setNotifications([]);
      setLoaded(false);
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        reloadNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
