import axios from "axios";

/* =========================
   🌐 AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   🔐 REQUEST INTERCEPTOR
   AUTO ATTACH JWT TOKEN
========================= */
api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    // Attach token for all protected APIs
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT:
    // For FormData (file uploads), let browser set multipart boundary
    if (req.data instanceof FormData) {
      delete req.headers["Content-Type"];
    }

    return req;
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
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
