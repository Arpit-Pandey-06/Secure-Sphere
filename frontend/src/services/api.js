import axios from "axios";

export const API_BASE = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ss_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;