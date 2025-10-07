import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Leave Requests API
export const leaveRequestApi = {
  getAll: () => api.get('/leaverequests').then(res => res.data),
  getById: (id) => api.get(`/leaverequests/${id}`).then(res => res.data),
  getByEmployee: (employeeId) => api.get(`/leaverequests/employee/${employeeId}`).then(res => res.data),
  getPendingForDepartmentManager: (managerId) => api.get(`/leaverequests/pending/department-manager/${managerId}`).then(res => res.data),
  getPendingForHrManager: () => api.get('/leaverequests/pending/hr-manager').then(res => res.data),
  create: (data) => api.post('/leaverequests', data).then(res => res.data),
  approve: (id, data) => api.put(`/leaverequests/${id}/approve`, data),
  cancel: (id, data) => api.put(`/leaverequests/${id}/cancel`, data),
  delete: (id) => api.delete(`/leaverequests/${id}`),
  getLeaveBalance: (employeeId) => api.get(`/leaverequests/employee/${employeeId}/balance`).then(res => res.data),
  getLeaveBalanceByYear: (employeeId, year) => api.get(`/leaverequests/employee/${employeeId}/balance/${year}`).then(res => res.data),
};

// Employees API
export const employeeApi = {
  getAll: () => api.get('/employees').then(res => res.data),
  getById: (id) => api.get(`/employees/${id}`).then(res => res.data),
  getByDepartment: (departmentId) => api.get(`/employees/department/${departmentId}`).then(res => res.data),
  getSubordinates: (managerId) => api.get(`/employees/subordinates/${managerId}`).then(res => res.data),
  create: (data) => api.post('/employees', data).then(res => res.data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  deactivate: (id) => api.put(`/employees/${id}/deactivate`),
  activate: (id) => api.put(`/employees/${id}/activate`),
};

// Leave Types API
export const leaveTypeApi = {
  getAll: () => api.get('/leavetypes').then(res => res.data),
  getById: (id) => api.get(`/leavetypes/${id}`).then(res => res.data),
  create: (data) => api.post('/leavetypes', data).then(res => res.data),
  update: (id, data) => api.put(`/leavetypes/${id}`, data),
  delete: (id) => api.delete(`/leavetypes/${id}`),
  activate: (id) => api.put(`/leavetypes/${id}/activate`),
  deactivate: (id) => api.put(`/leavetypes/${id}/deactivate`),
};

// Departments API
export const departmentApi = {
  getAll: () => api.get('/departments').then(res => res.data),
  getById: (id) => api.get(`/departments/${id}`).then(res => res.data),
  create: (data) => api.post('/departments', data).then(res => res.data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  activate: (id) => api.put(`/departments/${id}/activate`),
  deactivate: (id) => api.put(`/departments/${id}/deactivate`),
};

export default api;
