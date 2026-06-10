import axios from "axios";

const api = axios.create({
  baseURL: "https://stress-backend-v64j.onrender.com/api"
});

// Esto añade el token automáticamente en cada petición
// sin tener que ponerlo a mano cada vez
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
