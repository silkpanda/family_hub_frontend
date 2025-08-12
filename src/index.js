// --- File: /frontend/src/index.js ---
// The entry point of the React application. It renders the root App component into the DOM.

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles for the application.
import App from './App'; // The root component of the application.

// Create a root for the React application, targeting the 'root' div in index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component within React's StrictMode.
// StrictMode helps with highlighting potential problems in an application.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);