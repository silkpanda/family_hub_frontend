import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Corrected imports to use named exports from context files
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';

// Corrected imports for page components (default exports)
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import CalendarPage from './pages/CalendarPage';

// This is the core component that handles routing logic.
// It's rendered by the main App component after the AuthProvider is ready.
const AppRoutes = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading routes...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      <Route 
        path="/calendar" 
        element={token ? <CalendarPage /> : <Navigate to="/login" replace />} 
      />

      <Route 
        path="/" 
        element={token ? <Navigate to="/calendar" replace /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

// The main App component now focuses on setting up providers.
function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <CalendarProvider>
            <AppRoutes />
          </CalendarProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
