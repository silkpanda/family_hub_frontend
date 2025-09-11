import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

// --- Layouts and High-Level Components ---
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/auth/PrivateRoute';

// --- Page Components ---
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import ManageHouseholdPage from './pages/ManageHouseholdPage';
import StorePage from './pages/StorePage';
import MealPlannerPage from './pages/MealPlannerPage';

// --- Context Providers ---
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ModalProvider } from './context/ModalContext';
import { HouseholdProvider } from './context/HouseholdContext';
import { TaskProvider } from './context/TaskContext';
import { CalendarProvider } from './context/CalendarContext';
import { RewardProvider } from './context/RewardContext';

// --- Styles ---
import './styles/main.css';

function App() {
    return (
        <Router>
            <SocketProvider>
                <AuthProvider>
                    <ModalProvider>
                        <HouseholdProvider>
                            <TaskProvider>
                                <CalendarProvider>
                                    <RewardProvider>
                                        <Routes>
                                            {/* Public Routes */}
                                            <Route
                                                path="/login"
                                                element={<LoginPage />}
                                            />

                                            {/* Private Routes */}
                                            <Route
                                                path="/*"
                                                element={
                                                    <PrivateRoute>
                                                        <MainLayout />
                                                    </PrivateRoute>
                                                }
                                            >
                                                {/* Nested routes within MainLayout */}
                                                <Route
                                                    index
                                                    element={
                                                        <Navigate
                                                            to="/dashboard"
                                                            replace
                                                        />
                                                    }
                                                />
                                                <Route
                                                    path="dashboard"
                                                    element={<DashboardPage />}
                                                />
                                                <Route
                                                    path="tasks"
                                                    element={<TasksPage />}
                                                />
                                                <Route
                                                    path="calendar"
                                                    element={<CalendarPage />}
                                                />
                                                <Route
                                                    path="store"
                                                    element={<StorePage />}
                                                />
                                                <Route
                                                    path="meal-planner"
                                                    element={
                                                        <MealPlannerPage />
                                                    }
                                                />
                                                <Route
                                                    path="household"
                                                    element={
                                                        <ManageHouseholdPage />
                                                    }
                                                />
                                            </Route>
                                        </Routes>
                                    </RewardProvider>
                                </CalendarProvider>
                            </TaskProvider>
                        </HouseholdProvider>
                    </ModalProvider>
                </AuthProvider>
            </SocketProvider>
        </Router>
    );
}

export default App;

