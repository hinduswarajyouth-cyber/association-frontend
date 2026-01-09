import axios from "axios";

/* =====================================================
   🌐 AXIOS INSTANCE (FINAL & STABLE)
===================================================== */
const api = axios.create({
  // ✅ BACKEND HAS NO /api PREFIX
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  // example: https://api.hinduswarajyouth.online

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

/* =====================================================
   🔐 REQUEST INTERCEPTOR
   AUTO ATTACH JWT
===================================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ IMPORTANT FOR FILE UPLOADS
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   🚨 RESPONSE INTERCEPTOR
===================================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();

      // prevent infinite loop
      if (!window.location.pathname.includes("login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* =====================================================
   ✅ DEFAULT EXPORT ONLY
===================================================== */
export default api;
