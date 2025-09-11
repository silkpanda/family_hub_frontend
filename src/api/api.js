// This utility configures all API calls for the application.

// Read the backend URL from environment variables.
// This allows the app to connect to the correct backend whether it's running
// locally for development or in production on Netlify.
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

console.log(`API calls are being sent to: ${API_BASE_URL}`);

// A helper function to handle API responses.
const handleResponse = async (response) => {
    if (!response.ok) {
        // If the server responds with an error, throw an error to be caught by the caller.
        const errorData = await response.json().catch(() => ({ message: 'Network response was not ok.' }));
        throw new Error(errorData.message || 'Network response was not ok.');
    }
    // If the response is successful, parse the JSON body.
    return response.json();
};

// The main API object with methods for different types of requests.
export const api = {
    async get(endpoint) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            // This 'credentials: include' option tells the browser to
            // always send the session cookie with this request. This is
            // essential for the backend to know who is logged in.
            credentials: 'include',
        }).then(handleResponse);
    },

    async post(endpoint, body) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        }).then(handleResponse);
    },

    async put(endpoint, body) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        }).then(handleResponse);
    },

    async delete(endpoint) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then(handleResponse);
    },
};

