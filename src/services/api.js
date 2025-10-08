import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  createEmployee: (data) => api.post('/auth/employees', data).then(res => res.data),
  getAllEmployees: () => api.get('/auth/employees').then(res => res.data),
  getEmployeeById: (id) => api.get(`/auth/employees/${id}`).then(res => res.data),
  updateEmployee: (id, data) => api.put(`/auth/employees/${id}`, data),
  deactivateEmployee: (id) => api.delete(`/auth/employees/${id}`),
  getRoles: () => api.get('/auth/roles').then(res => res.data)
};

// Employee API
export const employeeApi = {
  getAll: () => api.get('/employees').then(res => res.data),
  getById: (id) => api.get(`/employees/${id}`).then(res => res.data),
  create: (data) => api.post('/employees', data).then(res => res.data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  deactivate: (id) => api.put(`/employees/${id}/deactivate`),
  activate: (id) => api.put(`/employees/${id}/activate`)
};

// Department API
export const departmentApi = {
  getAll: () => api.get('/departments').then(res => res.data),
  getById: (id) => api.get(`/departments/${id}`).then(res => res.data),
  create: (data) => api.post('/departments', data).then(res => res.data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  activate: (id) => api.put(`/departments/${id}/activate`),
  deactivate: (id) => api.put(`/departments/${id}/deactivate`)
};

// Leave Type API
export const leaveTypeApi = {
  getAll: () => api.get('/leave-types').then(res => res.data),
  getById: (id) => api.get(`/leave-types/${id}`).then(res => res.data),
  create: (data) => api.post('/leave-types', data).then(res => res.data),
  update: (id, data) => api.put(`/leave-types/${id}`, data),
  delete: (id) => api.delete(`/leave-types/${id}`),
  activate: (id) => api.put(`/leave-types/${id}/activate`),
  deactivate: (id) => api.put(`/leave-types/${id}/deactivate`)
};

// Leave Request API
export const leaveRequestApi = {
  getAll: () => api.get('/leave-requests').then(res => res.data),
  getById: (id) => api.get(`/leave-requests/${id}`).then(res => res.data),
  getMyRequests: () => api.get('/leave-requests/my-requests').then(res => res.data),
  getByEmployeeId: (employeeId) => api.get(`/leave-requests/employee/${employeeId}`).then(res => res.data),
  create: (data) => api.post('/leave-requests', data).then(res => res.data),
  update: (id, data) => api.put(`/leave-requests/${id}`, data),
  delete: (id) => api.delete(`/leave-requests/${id}`),
  approve: (id, data) => api.put(`/leave-requests/${id}/approve`, data),
  cancel: (id) => api.put(`/leave-requests/${id}/cancel`),
  getLeaveBalance: (employeeId) => api.get(`/leave-requests/employee/${employeeId}/balance`).then(res => res.data),
  getLeaveBalanceByYear: (employeeId, year) => api.get(`/leave-requests/employee/${employeeId}/balance/${year}`).then(res => res.data),
  getPendingForDepartmentManager: () => api.get('/leave-requests/pending/department-manager').then(res => res.data),
  getPendingForHrManager: () => api.get('/leave-requests/pending/hr-manager').then(res => res.data)
};

export default api;