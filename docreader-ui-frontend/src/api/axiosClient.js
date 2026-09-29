import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Do NOT trigger 401 interceptor logout/toast on login or register requests
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');

    // Suppress noisy "Network Error" toasts when backend is unreachable
    if (!error.response && !isAuthRequest) {
      // Network error (backend down) — silently reject
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired, please log in again.');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
