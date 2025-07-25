import axios from 'axios';
import { authService } from './auth.service'; // Import our new event service

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- NEW: Response Interceptor ---
// This watches for responses and handles global errors.
api.interceptors.response.use(
  (response) => response, // If the response is successful, just pass it through
  (error) => {
    // If the response is a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Trigger our global logout event.
      authService.triggerLogout();
    }
    return Promise.reject(error);
  }
);

export default api;
