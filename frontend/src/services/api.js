import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to automatically attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mr_office_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized on protected routes
      const isAuthRoute = window.location.pathname.startsWith('/admin/login');
      if (!isAuthRoute && window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('mr_office_token');
        localStorage.removeItem('mr_office_user');
        window.location.href = '/admin/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // System Health
  getHealth: () => apiClient.get('/api/health'),

  // Auth
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    getMe: () => apiClient.get('/api/auth/me'),
    logout: () => {
      localStorage.removeItem('mr_office_token');
      localStorage.removeItem('mr_office_user');
    },
    isAuthenticated: () => !!localStorage.getItem('mr_office_token'),
    getUser: () => {
      try {
        return JSON.parse(localStorage.getItem('mr_office_user') || 'null');
      } catch {
        return null;
      }
    },
  },

  // Products
  products: {
    list: (params) => apiClient.get('/api/products', { params }),
    featured: (limit = 6) => apiClient.get('/api/products/featured', { params: { limit } }),
    get: (idOrSlug) => apiClient.get(`/api/products/${idOrSlug}`),
    create: (data) => apiClient.post('/api/products', data),
    update: (id, data) => apiClient.put(`/api/products/${id}`, data),
    delete: (id) => apiClient.delete(`/api/products/${id}`),
  },

  // Enquiries
  enquiries: {
    submit: (data) => apiClient.post('/api/enquiries', data),
    list: (params) => apiClient.get('/api/enquiries', { params }),
    get: (id) => apiClient.get(`/api/enquiries/${id}`),
    updateStatus: (id, data) => apiClient.patch(`/api/enquiries/${id}/status`, data),
    delete: (id) => apiClient.delete(`/api/enquiries/${id}`),
  },

  // Settings
  settings: {
    get: () => apiClient.get('/api/settings'),
    update: (data) => apiClient.put('/api/settings', { settings: data }),
  },

  // Admin Dashboard
  admin: {
    getDashboard: () => apiClient.get('/api/admin/dashboard'),
  },
};

export default api;
