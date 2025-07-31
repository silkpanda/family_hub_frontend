// ===================================================================================
// File: /src/services/api.js
// Purpose: Configures and exports a centralized Axios instance for making API calls.
// It sets the base URL for all requests and includes interceptors to automatically
// attach the JWT authentication token to headers and to handle 401 Unauthorized errors
// by triggering a global logout.
// ===================================================================================
import axios from 'axios';
import { authService } from './auth.service';

// Create an Axios instance with a base URL from environment variables.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

// Request interceptor: This function runs before any request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage.
    const token = localStorage.getItem('authToken');
    if (token) {
      // If a token exists, add it to the Authorization header.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: This function runs on every response from the API.
api.interceptors.response.use(
  (response) => response, // If the response is successful (2xx), just pass it through.
  (error) => {
    // If the error response has a status of 401 (Unauthorized), it means the
    // token is invalid or expired.
    if (error.response && error.response.status === 401) {
      // Trigger a global logout event. The AuthContext listens for this event.
      authService.triggerLogout();
    }
    return Promise.reject(error);
  }
);

export default api;