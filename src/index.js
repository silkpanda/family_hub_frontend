import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import the Router
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { HouseholdProvider } from './context/HouseholdContext';
import { TaskProvider } from './context/TaskContext';
import { CalendarProvider } from './context/CalendarContext';
import { ModalProvider } from './context/ModalContext';
import { RewardProvider } from './context/RewardContext';
import { MealPlannerProvider } from './context/MealPlannerContext';
import { SocketProvider } from './context/SocketContext'; // Ensure SocketProvider is imported

const Root = () => (
    <StrictMode>
        <Router> {/* Wrap the entire application with the Router */}
            <SocketProvider>
                <AuthProvider>
                    <HouseholdProvider>
                        <ModalProvider>
                            <TaskProvider>
                                <CalendarProvider>
                                    <RewardProvider>
                                        <MealPlannerProvider>
                                            <App />
                                        </MealPlannerProvider>
                                    </RewardProvider>
                                </CalendarProvider>
                            </TaskProvider>
                        </ModalProvider>
                    </HouseholdProvider>
                </AuthProvider>
            </SocketProvider>
        </Router>
    </StrictMode>
);

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<Root />);

