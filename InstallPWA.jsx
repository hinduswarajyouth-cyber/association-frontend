import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt) return null;

  return (
    <button
      onClick={() => {
        prompt.prompt();
        setPrompt(null);
      }}
      style={installBtn}
    >
      📲 Install App
    </button>
  );
}

const installBtn = {
  position: "fixed",
  bottom: 20,
  right: 20,
  background: "#16a34a",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  fontWeight: "bold",
  zIndex: 999,
};
