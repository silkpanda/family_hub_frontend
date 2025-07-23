import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/LoginPage'; // Assuming you have this
import AuthCallbackPage from './pages/AuthCallbackPage'; // Assuming you have this
import CalendarPage from './pages/CalendarPage';

// Import Context Providers
import { AuthProvider, AuthContext } from './context/AuthContext'; // Assuming you have this
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';

// A helper component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  // This is a simplified check. Your AuthContext would have a more robust
  // way to check for a valid, non-expired token.
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    // The AuthProvider must be on the outside so other contexts can use it
    <AuthProvider>
      <SocketProvider>
        <CalendarProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <CalendarPage />
                  </PrivateRoute>
                } 
              />
              
              {/* Redirect root path to the dashboard or login */}
              <Route 
                path="/" 
                element={<Navigate to="/dashboard" />} 
              />

            </Routes>
          </Router>
        </CalendarProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
