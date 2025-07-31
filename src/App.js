// ===================================================================================
// File: /frontend/src/App.js
// Purpose: The main application component.
//
// --- UPDATE ---
// 1. Imported the new UserProfilePage component.
// 2. Added a new dynamic route for `/profile/:memberId`.
// ===================================================================================
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';

// --- Context Providers ---
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FamilyContext, FamilyProvider } from './context/FamilyContext';
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';
import { ListProvider } from './context/ListContext';
import { ChoreProvider } from './context/ChoreContext';
import { MealProvider } from './context/MealContext';

// --- Page Components ---
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import ListsPage from './pages/ListsPage';
import ChoresPage from './pages/ChoresPage';
import MealPlannerPage from './pages/MealPlannerPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import OnboardingPage from './pages/OnboardingPage';
import ManageFamilyPage from './pages/ManageFamilyPage';
import UserProfilePage from './pages/UserProfilePage'; // --- NEW ---
import Sidebar from './components/layout/Sidebar';

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

const AuthenticatedRoutes = () => {
    const { state } = useContext(FamilyContext);
    const { family, loading: familyLoading } = state;

    if (familyLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading family details...</p></div>;
    }
    
    if (family) {
        return (
            <AppLayout>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/lists" element={<ListsPage />} />
                    <Route path="/chores" element={<ChoresPage />} />
                    <Route path="/meals" element={<MealPlannerPage />} />
                    <Route path="/family" element={<ManageFamilyPage />} />
                    <Route path="/profile/:memberId" element={<UserProfilePage />} /> {/* --- NEW --- */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AppLayout>
        );
    }
    
    return (
        <Routes>
            <Route path="*" element={<OnboardingPage />} />
        </Routes>
    );
};

const AppRoutes = () => {
    const { isAuthenticated, isReady } = useContext(AuthContext);

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

function App() {
  return (
    <Router>
        <AuthProvider>
            <SocketProvider>
                <FamilyProvider>
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
