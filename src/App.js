// --- File: /frontend/src/App.js ---
// The main application component that sets up routing and context providers.

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme'; // Application-wide theme settings.
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FamilyContext, FamilyProvider } from './context/FamilyContext';
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';
import { ListProvider } from './context/ListContext';
import { ChoreProvider } from './context/ChoreContext';
import { MealProvider } from './context/MealContext';
import { StoreProvider } from './context/StoreContext';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import ListsPage from './pages/ListsPage';
import ChoresPage from './pages/ChoresPage';
import MealPlannerPage from './pages/MealPlannerPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import OnboardingPage from './pages/OnboardingPage';
import ManageFamilyPage from './pages/ManageFamilyPage';
import UserProfilePage from './pages/UserProfilePage';
import StorePage from './pages/StorePage';
import Sidebar from './components/layout/Sidebar';

// AppLayout: A layout component that includes the sidebar for authenticated views.
const AppLayout = ({ children }) => {
    const layoutStyle = { display: 'flex', height: '100vh', backgroundColor: theme.colors.neutralBackground };
    const mainContentStyle = { flexGrow: 1, overflowY: 'auto' };
    return ( <div style={layoutStyle}> <Sidebar /> <main style={mainContentStyle}>{children}</main> </div> );
};

// AppRoutes: Manages the application's routing logic based on authentication and family status.
const AppRoutes = () => {
    const { isAuthenticated, isReady } = useContext(AuthContext);
    const { state: familyState } = useContext(FamilyContext);

    // Display a loading message until authentication and family data are ready.
    if (!isReady || familyState.loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading application...</p></div>;
    }

    // **BUG FIX:** This routing logic is updated to correctly handle all application states.
    // If a user is logged in but has no family, they are directed to onboarding.
    if (isAuthenticated && !familyState.family) {
        return (
            <Routes>
                <Route path="*" element={<OnboardingPage />} />
            </Routes>
        );
    }
    
    // Define the main application routes. These are accessible in both Kiosk and Parent modes.
    const mainContent = (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/lists" element={<ListsPage />} />
            <Route path="/chores" element={<ChoresPage />} />
            <Route path="/meals" element={<MealPlannerPage />} />
            <Route path="/family" element={<ManageFamilyPage />} />
            <Route path="/profile/:memberId" element={<UserProfilePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );

    // This is the main router. It handles public routes and decides whether to show
    // the main content in Kiosk Mode (no sidebar) or Parent Mode (with sidebar).
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
                path="*"
                element={
                    isAuthenticated ? (
                        <AppLayout>{mainContent}</AppLayout>
                    ) : (
                        mainContent // Kiosk Mode: User is not authenticated, show main content without sidebar.
                    )
                }
            />
        </Routes>
    );
};


// App: The root component that wraps the entire application with context providers.
function App() {
  return (
    <Router>
        <AuthProvider>
            <SocketProvider>
                <FamilyProvider>
                    <StoreProvider>
                        <CalendarProvider>
                            <ListProvider>
                                <ChoreProvider>
                                    <MealProvider>
                                        <AppRoutes />
                                    </MealProvider>
                                </ChoreProvider>
                            </ListProvider>
                        </CalendarProvider>
                    </StoreProvider>
                </FamilyProvider>
            </SocketProvider>
        </AuthProvider>
    </Router>
  );
}
export default App;
