import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// --- Context Providers ---
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FamilyContext, FamilyProvider } from './context/FamilyContext';
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';
import { ListProvider } from './context/ListContext';
import { ChoreProvider } from './context/ChoreContext';
import { MealProvider } from './context/MealContext';

// --- Page Components ---
import CalendarPage from './pages/CalendarPage';
import ListsPage from './pages/ListsPage';
import ChoresPage from './pages/ChoresPage';
import MealPlannerPage from './pages/MealPlannerPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import OnboardingPage from './pages/OnboardingPage';

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
                            <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Calendar</Link>
                            <Link to="/lists" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Lists</Link>
                            <Link to="/chores" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Chores</Link>
                            <Link to="/meals" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Meal Planner</Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600">Logout</button>
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

// --- AppRoutes component to handle all routing logic ---
const AppRoutes = () => {
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const { family, loading: familyLoading } = useContext(FamilyContext);

    // Show a global loading screen while checking auth and family status
    if (authLoading || familyLoading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading application...</p></div>;
    }

    // If user is logged in but has not completed onboarding (no family attached),
    // force them to the onboarding page.
    if (isAuthenticated && !family) {
        return (
            <Routes>
                <Route path="*" element={<OnboardingPage />} />
            </Routes>
        );
    }
    
    // If user is logged in AND has a family, show the main application.
    if (isAuthenticated && family) {
        return (
            <AppLayout>
                <Routes>
                    <Route path="/" element={<CalendarPage />} />
                    <Route path="/lists" element={<ListsPage />} />
                    <Route path="/chores" element={<ChoresPage />} />
                    <Route path="/meals" element={<MealPlannerPage />} />
                    {/* Any other unknown authenticated path redirects to the calendar */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AppLayout>
        );
    }

    // If not authenticated, show public routes and redirect all others to login.
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

function App() {
  return (
    <Router>
        <AuthProvider>
          <FamilyProvider>
            <SocketProvider>
              <CalendarProvider>
                <ListProvider>
                  <ChoreProvider>
                    <MealProvider>
                      <AppRoutes />
                    </MealProvider>
                  </ChoreProvider>
                </ListProvider>
              </CalendarProvider>
            </SocketProvider>
          </FamilyProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;
