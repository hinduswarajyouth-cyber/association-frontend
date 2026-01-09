import axios from "axios";

/* =========================
   🌐 AXIOS INSTANCE (FINAL)
========================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ❌ NO /api here
  headers: {
    "Content-Type": "application/json",
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

    // FormData support
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   🚨 RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api; // ✅ DEFAULT EXPORT (CRITICAL)
