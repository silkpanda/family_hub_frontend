import React from 'react';
import ReactDOM from 'react-dom/client';
// The import for index.css has been removed to prevent errors if the file doesn't exist.
// You can add it back later if you create a src/index.css file.
import App from './App';

// This is the main entry point of your React application.
// It finds the 'root' div in your public/index.html file.
const root = ReactDOM.createRoot(document.getElementById('root'));

// It renders your main App component, wrapping it in StrictMode
// to highlight potential problems in the application.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
