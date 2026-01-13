import axios from "axios";

/* =========================
   🌐 AXIOS INSTANCE (FINAL)
========================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache"
  },
  withCredentials: true,
});

/* =========================
   🔐 REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   🚨 RESPONSE INTERCEPTOR (FIXED)
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (
      status === 401 &&
      !currentPath.startsWith("/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.replace("/login?expired=1");
    }

    return Promise.reject(error);
  }
);

export default api;
