import axios from 'axios';

const API_URL = '/api';

// Books API
export const booksAPI = {
  getAll: (params) => axios.get(`${API_URL}/books`, { params }),
  getById: (id) => axios.get(`${API_URL}/books/${id}`),
  create: (data) => axios.post(`${API_URL}/books`, data),
  update: (id, data) => axios.put(`${API_URL}/books/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/books/${id}`),
  getStats: () => axios.get(`${API_URL}/books/admin/stats`)
};

// Rentals API
export const rentalsAPI = {
  getAll: (params) => axios.get(`${API_URL}/rentals`, { params }),
  getById: (id) => axios.get(`${API_URL}/rentals/${id}`),
  create: (data) => axios.post(`${API_URL}/rentals`, data),
  returnBook: (id) => axios.put(`${API_URL}/rentals/${id}/return`),
  cancel: (id) => axios.put(`${API_URL}/rentals/${id}/cancel`),
  getStats: () => axios.get(`${API_URL}/rentals/admin/stats`)
};

// Auth API
export const authAPI = {
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  getProfile: () => axios.get(`${API_URL}/auth/me`),
  updateProfile: (data) => axios.put(`${API_URL}/auth/updateprofile`, data),
  updatePassword: (data) => axios.put(`${API_URL}/auth/updatepassword`, data)
};

export default {
  books: booksAPI,
  rentals: rentalsAPI,
  auth: authAPI
};
