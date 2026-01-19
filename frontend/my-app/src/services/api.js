import axios from "axios";

// Use environment variable or default to backend URL
const baseURL = import.meta.env.VITE_API_URL || "https://curelink-1ukh.onrender.com/api";

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true
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

// Response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    }
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

// User API functions
export const userAPI = {
  updateProfile: (profileData) => API.put("/users/profile", profileData),
};

// Patient Record API functions
export const recordAPI = {
  // Upload a record (FormData with file, category, title, description)
  uploadRecord: (formData) => API.post("/records/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  // Get patient's own records
  getMyRecords: () => API.get("/records/my-records"),
  // Get patient records by username (doctor only)
  getPatientRecordsByUsername: (username) => API.get(`/records/patient/${username}`),
  // Update prescription/diagnosis (doctor only)
  updateRecord: (recordId, data) => API.put(`/records/${recordId}/update`, data),
  // Get file URL
  getRecordFileUrl: (recordId) => `https://curelink-1ukh.onrender.com/api/records/${recordId}/file`,
  // Delete a record
  deleteRecord: (recordId) => API.delete(`/records/${recordId}`),
};

export default API;
