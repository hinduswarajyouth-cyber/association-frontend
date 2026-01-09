import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const res = await axios.get("/notifications");
    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await axios.post(`/notifications/read/${id}`);
    setNotifications(n =>
      n.map(x => (x.id === id ? { ...x, is_read: true } : x))
    );
  };

  useEffect(() => {
    loadNotifications();
    const t = setInterval(loadNotifications, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
