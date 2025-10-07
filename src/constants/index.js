// Leave Request Status
export const LeaveRequestStatus = {
  Pending: 0,
  ApprovedByDepartmentManager: 1,
  ApprovedByHrManager: 2,
  RejectedByDepartmentManager: 3,
  RejectedByHrManager: 4,
  Cancelled: 5
};

export const LeaveRequestStatusLabels = {
  [LeaveRequestStatus.Pending]: 'Beklemede',
  [LeaveRequestStatus.ApprovedByDepartmentManager]: 'Departman Yöneticisi Onayladı',
  [LeaveRequestStatus.ApprovedByHrManager]: 'İK Müdürü Onayladı',
  [LeaveRequestStatus.RejectedByDepartmentManager]: 'Departman Yöneticisi Reddetti',
  [LeaveRequestStatus.RejectedByHrManager]: 'İK Müdürü Reddetti',
  [LeaveRequestStatus.Cancelled]: 'İptal Edildi'
};

export const LeaveRequestStatusColors = {
  [LeaveRequestStatus.Pending]: 'yellow',
  [LeaveRequestStatus.ApprovedByDepartmentManager]: 'blue',
  [LeaveRequestStatus.ApprovedByHrManager]: 'green',
  [LeaveRequestStatus.RejectedByDepartmentManager]: 'red',
  [LeaveRequestStatus.RejectedByHrManager]: 'red',
  [LeaveRequestStatus.Cancelled]: 'gray'
};

// User Roles
export const UserRole = {
  Admin: 'SystemAdmin',
  HrManager: 'HrManager',
  DepartmentManager: 'DepartmentManager',
  Employee: 'Employee'
};

export const UserRoleLabels = {
  [UserRole.Admin]: 'Yönetici',
  [UserRole.HrManager]: 'İK Müdürü',
  [UserRole.DepartmentManager]: 'Departman Yöneticisi',
  [UserRole.Employee]: 'Çalışan'
};

// Employee Status
export const EmployeeStatus = {
  Active: true,
  Inactive: false
};

export const EmployeeStatusLabels = {
  [EmployeeStatus.Active]: 'Aktif',
  [EmployeeStatus.Inactive]: 'Pasif'
};

export const EmployeeStatusColors = {
  [EmployeeStatus.Active]: 'green',
  [EmployeeStatus.Inactive]: 'red'
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://localhost:7000/api',
  TIMEOUT: 10000
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD.MM.YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD.MM.YYYY HH:mm'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9+\-\s()]+$/,
  EMPLOYEE_NUMBER_REGEX: /^[A-Z0-9]+$/
};
