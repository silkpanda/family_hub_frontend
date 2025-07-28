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
import CalendarPage from './pages/CalendarPage';
import ListsPage from './pages/ListsPage';
import ChoresPage from './pages/ChoresPage';
import MealPlannerPage from './pages/MealPlannerPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import OnboardingPage from './pages/OnboardingPage';
import ManageFamilyPage from './pages/ManageFamilyPage';

// --- Layout Components ---
import Sidebar from './components/layout/Sidebar'; // <-- New Sidebar import

// --- Layout component to wrap protected pages with the new sidebar ---
const AppLayout = ({ children }) => {
    const layoutStyle = {
        display: 'flex',
        height: '100vh',
        backgroundColor: theme.colors.neutralBackground,
    };

    const mainContentStyle = {
        flexGrow: 1,
        overflowY: 'auto', // Allows content to scroll independently
        padding: theme.spacing.xl,
    };

    return (
        <div style={layoutStyle}>
            <Sidebar />
            <main style={mainContentStyle}>
                {children}
            </main>
        </div>
    );
};

// --- AppRoutes component to handle all routing logic ---
const AppRoutes = () => {
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const { family, loading: familyLoading } = useContext(FamilyContext);

    if (authLoading || familyLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading application...</p></div>;
    }

    if (isAuthenticated && !family) {
        return (
            <Routes>
                <Route path="*" element={<OnboardingPage />} />
            </Routes>
        );
    }
    
    if (isAuthenticated && family) {
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
