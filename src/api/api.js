// This file configures the base URL for all frontend API calls.

// It reads the backend URL from the environment variables provided by Netlify during the build.
// If the variable is not found (e.g., during local development), it falls back to a localhost URL.
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

console.log(`API calls are being sent to: ${API_BASE_URL}`);

// A helper object to make consistent API calls
export const api = {
    async get(endpoint, token) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    },
    async post(endpoint, body, token) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    },
    async put(endpoint, body, token) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    },
    async delete(endpoint, token) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    },
};

