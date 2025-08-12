// --- File: /frontend/src/services/api.js ---
// Configures a global Axios instance for making API requests.

import axios from 'axios';
import { authService } from './auth.service';

// Create an Axios instance with a base URL from environment variables.
const api = axios.create({ 
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api' 
});

// Request interceptor: Attaches the JWT token to the Authorization header of every request.
api.interceptors.request.use(
    (config) => { 
        const token = localStorage.getItem('authToken'); 
        if (token) { 
            config.headers['Authorization'] = `Bearer ${token}`; 
        } 
        return config; 
    }, 
    (error) => Promise.reject(error)
);

// Response interceptor: Handles 401 Unauthorized errors by triggering a global logout.
api.interceptors.response.use(
    (response) => response, 
    (error) => { 
        if (error.response && error.response.status === 401) { 
            authService.triggerLogout(); 
        } 
        return Promise.reject(error); 
    }
);

export default api;