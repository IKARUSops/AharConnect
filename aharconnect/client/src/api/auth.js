// src/api/index.js
import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
// });

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your deployed URL later
});

// Add auth token to every request
API.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const signupUser = (userData) => API.post('/auth/signup', userData);
export const signinUser = (userData) => API.post('/auth/login', userData);
export const logout = () => {
  localStorage.removeItem('authToken'); // Clear the token
  localStorage.removeItem('userType'); // Clear the user type
  window.location.href = '/sign-in'; // Redirect to the login page
};
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token; // Returns true if token exists, false otherwise
};
// Expense API
export const getExpenses = (timeRange) => API.get(`/expenses?timeRange=${timeRange}`);
export const createExpense = (expenseData) => API.post('/expenses', expenseData);
export const updateExpense = (id, expenseData) => API.put(`/expenses/${id}`, expenseData);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getExpenseStatistics = (timeRange) => API.get(`/expenses/statistics?timeRange=${timeRange}`);

export default API;