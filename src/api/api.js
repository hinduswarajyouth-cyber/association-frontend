import axios from "axios";

/* =========================
   🌐 AXIOS INSTANCE (FINAL)
========================= */
const api = axios.create({
  // ✅ BASE URL MUST INCLUDE /api
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. https://api.hinduswarajyouth.online/api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ safe for auth
});

/* =========================
   🔐 REQUEST INTERCEPTOR
   AUTO ATTACH JWT TOKEN
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Attach token ONLY if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT: For file uploads (FormData)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   🚨 RESPONSE INTERCEPTOR
   HANDLE AUTH FAILS
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid
      localStorage.clear();

      // 🔥 Prevent redirect loop on public pages
      if (!window.location.pathname.includes("forgot-password")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
