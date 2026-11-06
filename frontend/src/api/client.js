const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('attendance_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('attendance_token');
      localStorage.removeItem('attendance_user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/kiosk')) {
        window.location.href = '/login';
      }
    }
    const errorMsg = (typeof data === 'object' && data.message) ? data.message : 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => apiRequest('/auth/me'),
  getDemoAccounts: () => apiRequest('/auth/demo-accounts'),

  // Attendance
  getTodayStatus: () => apiRequest('/attendance/today-status'),
  scanQr: (payload) =>
    apiRequest('/attendance/scan', { method: 'POST', body: JSON.stringify(payload) }),
  getMyHistory: () => apiRequest('/attendance/my-history'),
  getLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/attendance/logs?${qs}`);
  },
  manualOverride: (payload) =>
    apiRequest('/attendance/manual-override', { method: 'POST', body: JSON.stringify(payload) }),

  // QR & Geofence
  getKioskToken: () => apiRequest('/qr/kiosk-token'),
  getGeofenceConfig: () => apiRequest('/qr/geofence-config'),
  updateGeofenceConfig: (payload) =>
    apiRequest('/qr/geofence-config', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin Users
  getUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/users?${qs}`);
  },
  createUser: (userData) =>
    apiRequest('/users', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: (id, updates) =>
    apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteUser: (id) =>
    apiRequest(`/users/${id}`, { method: 'DELETE' }),

  // Reports
  getDashboardMetrics: () => apiRequest('/reports/dashboard-metrics'),
  getExcelExportUrl: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const token = localStorage.getItem('attendance_token');
    return `${BASE_URL}/reports/export-excel?token=${token}&${qs}`;
  },
};

