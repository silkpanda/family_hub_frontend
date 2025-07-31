// ===================================================================================
// File: /src/index.js
// Purpose: This is the main entry point for the React application. It finds the 'root'
// HTML element and renders the main App component into it. React.StrictMode is used
// to highlight potential problems in the application during development.
// ===================================================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming a base CSS file for global styles like fonts
import App from './App';

// Create a root for the React application, targeting the div with id 'root' in index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component within React's Strict Mode.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);