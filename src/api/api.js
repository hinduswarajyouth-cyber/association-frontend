import axios from "axios";

/* =========================
   🌐 AXIOS INSTANCE (FINAL)
========================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ NO /api
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

    // ✅ Allow FormData (file uploads)
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
      // 🔥 Session expired / invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ✅ Redirect with reason
      window.location.href = "/login?expired=1";
    }

    return Promise.reject(error);
  }
);

export default api;
