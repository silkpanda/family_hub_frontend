import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthSuccessPage from './pages/AuthSuccessPage';

function App() {
  // In a real app, you'd manage user login state with Context API or Redux
  // For simplicity, we'll use local storage or check params for now.
  const isAuthenticated = localStorage.getItem('userId'); // Simple check

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/auth-success" element={<AuthSuccessPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;