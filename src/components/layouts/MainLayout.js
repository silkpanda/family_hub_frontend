import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Define icons for navigation links for a better UI
const navLinks = [
    { to: '/dashboard', text: 'Dashboard', icon: '🏠' },
    { to: '/tasks', text: 'Tasks', icon: '✔️' },
    { to: '/calendar', text: 'Calendar', icon: '📅' },
    { to: '/meal-planner', text: 'Meal Planner', icon: '🍲' },
    { to: '/store', text: 'Store', icon: '🛒' },
    { to: '/manage-household', text: 'Settings', icon: '⚙️' },
];

const MainLayout = () => {
    const { fullLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        fullLogout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold text-center mb-8 border-b border-gray-700 pb-4">
                    FamiliFlow
                </h1>
                <nav className="flex-grow">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${
                                    isActive ? 'bg-indigo-600' : ''
                                }`
                            }
                        >
                            <span className="mr-3 text-lg">{link.icon}</span>
                            <span className="font-medium">{link.text}</span>
                        </NavLink>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-3 mt-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                    <span className="mr-2">🚪</span>
                    <span className="font-bold">Logout</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {/* Outlet is a placeholder from react-router-dom where the child route component will be rendered */}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
