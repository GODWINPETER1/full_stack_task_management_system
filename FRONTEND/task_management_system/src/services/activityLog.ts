import axios from "axios";

// Base API configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// Add Authorization header with Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Replace with your token storage logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
