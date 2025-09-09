import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { HouseholdProvider } from './context/HouseholdContext';
import { TaskProvider } from './context/TaskContext';
import { CalendarProvider } from './context/CalendarContext';
import { ModalProvider } from './context/ModalContext';
import { RewardProvider } from './context/RewardContext';
import { MealPlannerProvider } from './context/MealPlannerContext';

const Root = () => (
    <StrictMode>
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
    </StrictMode>
);

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<Root />);





