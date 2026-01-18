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
  getRecordFileUrl: (recordId) => `http://localhost:5000/api/records/${recordId}/file`,
  // Delete a record
  deleteRecord: (recordId) => API.delete(`/records/${recordId}`),
};

export default API;
