import { useEffect, useState } from "react";

export default function UpdatePrompt() {
  const [waitingSW, setWaitingSW] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      if (reg.waiting) {
        setWaitingSW(reg.waiting);
      }

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setWaitingSW(newWorker);
          }
        });
      });
    });
  }, []);

  if (!waitingSW) return null;

  return (
    <div style={popup}>
      <span>♻️ New version available</span>
      <button
        style={btn}
        onClick={() => {
          waitingSW.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }}
      >
        Refresh
      </button>
    </div>
  );
}

const popup = {
  position: "fixed",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  background: "#0f172a",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 10,
  display: "flex",
  gap: 12,
  alignItems: "center",
  zIndex: 1000,
};

const btn = {
  background: "#16a34a",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};
