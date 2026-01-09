import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

/* =========================
   CONTEXT PROVIDERS
========================= */
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

/* =========================
   GLOBAL STYLES (if any)
========================= */
// import "./index.css";

/* =====================================================
   🚀 APPLICATION BOOTSTRAP (FINAL)
===================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
