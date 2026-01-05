import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div style={banner}>
      📴 You are offline. Please check your internet connection.
    </div>
  );
}

const banner = {
  background: "#dc2626",
  color: "#fff",
  padding: "8px 12px",
  textAlign: "center",
  fontWeight: 600,
  fontSize: 14,
};
