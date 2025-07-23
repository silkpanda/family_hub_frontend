import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';

import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import CalendarPage from './pages/CalendarPage';

// A protected route component to guard pages that require authentication.
const ProtectedRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    // The AuthProvider must be at the top level.
    <AuthProvider>
      {/* The SocketProvider is nested inside AuthProvider so it can access
        the auth token to establish a secure, authenticated connection.
      */}
      <SocketProvider>
        {/* Feature-specific providers like CalendarProvider go inside SocketProvider
          so they can access the socket instance for real-time listeners.
        */}
        <CalendarProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              
              {/* Example of a protected route */}
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                } 
              />

              {/* Default route redirects to the calendar if logged in, or login if not */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Navigate to="/calendar" />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </CalendarProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
