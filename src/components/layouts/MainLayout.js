import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { HouseholdContext } from '../../context/HouseholdContext';
import DashboardPage from '../../pages/DashboardPage';
import TasksPage from '../../pages/TasksPage';
import CalendarPage from '../../pages/CalendarPage';
import ManageHouseholdPage from '../../pages/ManageHouseholdPage';
import StorePage from '../../pages/StorePage';
import MealPlannerPage from '../../pages/MealPlannerPage';
import Button from '../ui/Button';

const MainLayout = ({ currentView, setCurrentView, onSelectMember, activeMemberId }) => {
    const { session, fullLogout, lockSession, isParentSession } = useContext(AuthContext);
    const { householdData } = useContext(HouseholdContext);

    const renderView = () => {
        switch (currentView) {
            case 'tasks':
                return <TasksPage />;
            case 'calendar':
                return <CalendarPage />;
            case 'manage':
                return <ManageHouseholdPage />;
            case 'store':
                return <StorePage activeMemberId={activeMemberId} />;
            case 'meal-planner':
                return <MealPlannerPage />;
            case 'dashboard':
            default:
                return <DashboardPage onSelectMember={onSelectMember} />;
        }
    };

    const navButtonStyle = "font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out";
    const activeNavButtonStyle = "bg-indigo-600 text-white shadow-md";
    const inactiveNavButtonStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900";

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{householdData.household?.name || 'FamiliFlow'}</h1>
                        <p className="text-sm text-gray-500">Welcome, {session.user?.displayName || 'User'}</p>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => setCurrentView('dashboard')} className={`${navButtonStyle} ${currentView === 'dashboard' ? activeNavButtonStyle : inactiveNavButtonStyle}`}>Dashboard</button>
                            <button onClick={() => setCurrentView('tasks')} className={`${navButtonStyle} ${currentView === 'tasks' ? activeNavButtonStyle : inactiveNavButtonStyle}`}>Tasks</button>
                            <button onClick={() => setCurrentView('calendar')} className={`${navButtonStyle} ${currentView === 'calendar' ? activeNavButtonStyle : inactiveNavButtonStyle}`}>Calendar</button>
                            <button onClick={() => setCurrentView('meal-planner')} className={`${navButtonStyle} ${currentView === 'meal-planner' ? activeNavButtonStyle : inactiveNavButtonStyle}`}>Meal Plan</button>
                            <button onClick={() => setCurrentView('store')} className={`${navButtonStyle} ${currentView === 'store' ? activeNavButtonStyle : inactiveNavButtonStyle}`}>Store</button>
                            <button onClick={() => setCurrentView('manage')} className={`${navButtonStyle} ${currentView === 'manage' ? activeNavButtonStyle : inactiveNavButtonStyle}`}>Household</button>
                        </div>
                        <div className="w-px h-6 bg-gray-300 mx-2"></div>
                        {isParentSession && (<Button onClick={lockSession} className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">Lock</Button>)}
                        <Button onClick={fullLogout} variant="danger">Log Out</Button>
                    </nav>
                </div>
            </header>
            <main className="p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
