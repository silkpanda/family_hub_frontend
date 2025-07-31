// ===================================================================================
// File: /frontend/src/App.js
// Purpose: The main application component. It sets up all context providers and
// contains the top-level routing logic that determines which page to display based
// on the user's authentication and onboarding status.
// ===================================================================================
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';

// --- Context Providers ---
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FamilyContext, FamilyProvider } from './context/FamilyContext'; // Import FamilyProvider
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
import ManageFamilyPage from './pages/ManageFamilyPage';
import Sidebar from './components/layout/Sidebar';

/**
 * AppLayout Component
 * Wraps the main application pages with the persistent sidebar navigation.
 */
const AppLayout = ({ children }) => {
    const layoutStyle = {
        display: 'flex',
        height: '100vh',
        backgroundColor: theme.colors.neutralBackground,
    };
    const mainContentStyle = {
        flexGrow: 1,
        overflowY: 'auto',
        padding: theme.spacing.xl,
    };
    return (
        <div style={layoutStyle}>
            <Sidebar />
            <main style={mainContentStyle}>{children}</main>
        </div>
    );
};

/**
 * AuthenticatedRoutes Component
 * Handles all routing logic for a logged-in user. It checks if the user belongs
 * to a family to decide whether to show the main application or the onboarding flow.
 */
const AuthenticatedRoutes = () => {
    const { state } = useContext(FamilyContext);
    const { family, loading: familyLoading } = state;

    // CRUCIAL LOG: See the family state being evaluated by AuthenticatedRoutes
    console.log(`[AuthenticatedRoutes] Family Loading: ${familyLoading}, Family Data: ${family ? family.name : 'null'}`);

    if (familyLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading family details...</p></div>;
    }
    
    // If family data is present, render the main app layout
    if (family) {
        console.log('[AuthenticatedRoutes] Family exists, rendering main app.');
        return (
            <AppLayout>
                <Routes>
                    <Route path="/" element={<CalendarPage />} />
                    <Route path="/lists" element={<ListsPage />} />
                    <Route path="/chores" element={<ChoresPage />} />
                    <Route path="/meals" element={<MealPlannerPage />} />
                    <Route path="/family" element={<ManageFamilyPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AppLayout>
        );
    }
    
    // If family data is null (after loading), redirect to onboarding
    console.log('[AuthenticatedRoutes] No family found, redirecting to OnboardingPage.');
    return (
        <Routes>
            <Route path="*" element={<OnboardingPage />} />
        </Routes>
    );
};

/**
 * AppRoutes Component
 * The top-level router. It waits for the authentication status to be ready
 * and then decides whether to show public pages or the authenticated app.
 */
const AppRoutes = () => {
    const { isAuthenticated, isReady } = useContext(AuthContext);

    // CRUCIAL LOG: See the overall authentication and readiness status
    console.log(`[AppRoutes] Auth Ready: ${isReady}, Authenticated: ${isAuthenticated}`);

    if (!isReady) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading application...</p></div>;
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
                path="*"
                element={
                    isAuthenticated ? (
                        <AuthenticatedRoutes />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
        </Routes>
    );
}

/**
 * Main App Component
 * The root of the component tree. It wraps the entire application in all
 * the necessary Context Providers.
 */
function App() {
  return (
    <Router>
        <AuthProvider>
            <SocketProvider>
                <FamilyProvider> {/* Ensure FamilyProvider is here */}
                    <CalendarProvider>
                        <ListProvider>
                            <ChoreProvider>
                                <MealProvider>
                                    <AppRoutes />
                                </MealProvider>
                            </ChoreProvider>
                        </ListProvider>
                    </CalendarProvider>
                </FamilyProvider>
            </SocketProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;