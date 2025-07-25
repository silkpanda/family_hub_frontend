import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// --- Context Providers ---
import { AuthContext, AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';
import { ListProvider } from './context/ListContext';

// --- Page Components ---
import CalendarPage from './pages/CalendarPage';
import ListsPage from './pages/ListsPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// --- Helper component to protect routes ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// --- Simple Navbar for navigation ---
const Navbar = () => {
    const { logout } = useContext(AuthContext);
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">Family Hub</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Calendar
                            </Link>
                            <Link to="/lists" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Lists
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};


// --- Layout component to wrap protected pages ---
const AppLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

// --- AppRoutes component to handle routing logic ---
const AppRoutes = () => {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CalendarPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lists" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ListsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* --- FIX --- This new route catches any requests to /dashboard and redirects to the correct homepage */}
            <Route path="/dashboard" element={<Navigate to="/" />} />

            {/* A catch-all to redirect any other unknown path to the main page */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}


function App() {
  return (
    <Router>
        <AuthProvider>
          <SocketProvider>
            <CalendarProvider>
              <ListProvider>
                <AppRoutes />
              </ListProvider>
            </CalendarProvider>
          </SocketProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;
