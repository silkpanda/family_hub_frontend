import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext'; // Import the SocketProvider
import { HouseholdProvider } from './context/HouseholdContext';
import { ModalProvider } from './context/ModalContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManageHouseholdPage from './pages/ManageHouseholdPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import StorePage from './pages/StorePage';
import MealPlannerPage from './pages/MealPlannerPage';
import PrivateRoute from './components/auth/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import './styles/main.css';

const App = () => {
    return (
        <Router>
            <SocketProvider>
                <AuthProvider>
                    <HouseholdProvider>
                        <ModalProvider>
                            <Routes>
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/"
                                    element={
                                        <PrivateRoute>
                                            <MainLayout />
                                        </PrivateRoute>
                                    }
                                >
                                    <Route index element={<Navigate to="/dashboard" />} />
                                    <Route path="dashboard" element={<DashboardPage />} />
                                    <Route path="manage-household" element={<ManageHouseholdPage />} />
                                    <Route path="tasks" element={<TasksPage />} />
                                    <Route path="calendar" element={<CalendarPage />} />
                                    <Route path="store" element={<StorePage />} />
                                    <Route path="meal-planner" element={<MealPlannerPage />} />
                                </Route>
                            </Routes>
                        </ModalProvider>
                    </HouseholdProvider>
                </AuthProvider>
            </SocketProvider>
        </Router>
    );
};

export default App;
