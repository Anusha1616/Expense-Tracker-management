import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-management-sw2z.vercel.app/api"
});
// ===============================
// ADD JWT TOKEN TO REQUEST
// ===============================

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// HANDLE EXPIRED / INVALID JWT
// ===============================

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const token = localStorage.getItem("token");

    const isLoginRequest =
      error.config?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      token &&
      !isLoginRequest
    ) {
      // Remove expired token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loggedIn");

      alert("Your session has expired. Please login again.");

      // Go back to login page
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;