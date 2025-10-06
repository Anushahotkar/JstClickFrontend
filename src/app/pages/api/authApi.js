// src/api/authApi.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allow cookies (refreshToken in cookie)
});

// attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/admin/refresh`,
          {},
          { withCredentials: true } // send refreshToken cookie
        );

        const { accessToken, refreshToken } = res.data.data;

        // store new tokens
        localStorage.setItem("authToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken); // optional if you also store it
        }

        // retry the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // redirect
      }
    }

    return Promise.reject(error);
  }
);

export const getCurrentUser = async () => {
  const res = await api.get("/admin/me");
  return res.data;
};

export default api;
