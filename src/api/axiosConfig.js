import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Interceptor to attach user ID to requests (for our simple auth example)
api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage
    if (userId) {
        config.headers['x-user-id'] = userId; // Attach to custom header
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;