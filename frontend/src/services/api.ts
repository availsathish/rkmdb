import axios from 'axios';

// Set base URL for API requests
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API endpoints
export const customerAPI = {
  getAll: () => api.get('/customers/'),
  getById: (id: number | string) => api.get(`/customers/${id}`),
  create: (data: Record<string, any>) => api.post('/customers/', data),
  update: (id: number | string, data: Record<string, any>) => api.put(`/customers/${id}`, data),
  delete: (id: number | string) => api.delete(`/customers/${id}`),
};

// Product API endpoints
export const productAPI = {
  getAll: () => api.get('/products/'),
  getById: (id: number | string) => api.get(`/products/${id}`),
  create: (formData: FormData) => api.post('/products/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id: number | string, formData: FormData) => api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id: number | string) => api.delete(`/products/${id}`),
};

export default api;
