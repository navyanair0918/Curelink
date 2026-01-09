import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => API.post("/auth/register", userData),
  login: (userData) => API.post("/auth/login", userData),
  getCurrentUser: () => API.get("/auth/me"),
};

// Admin API functions
export const adminAPI = {
  getAllUsers: () => API.get("/admin/users"),
  getAllPatients: () => API.get("/admin/patients"),
  getAllDoctors: () => API.get("/admin/doctors"),
  getAllAppointments: () => API.get("/admin/appointments"),
  getDashboardStats: () => API.get("/admin/stats"),
};

export default API;
