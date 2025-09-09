import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

/**
 * The Sidebar component provides the main navigation for the application.
 * It is only visible in 'parent' mode. It displays links to different pages
 * and includes controls for locking the session back to kiosk mode or logging out completely.
 */
const Sidebar = ({ setRoute }) => {
    const { isParentSession, lockSession, fullLogout } = useContext(AuthContext);

    // Define the navigation items. The 'Family' link is conditionally shown for parents.
    const navItems = [
        { name: 'Dashboard', icon: 'fa-solid fa-house-chimney', route: 'dashboard' },
        { name: 'Calendar', icon: 'fa-solid fa-calendar-days', route: 'calendar' },
        { name: 'Chores', icon: 'fa-solid fa-broom', route: 'chores' },
        { name: 'Store', icon: 'fa-solid fa-store', route: 'store' },
        { name: 'Meal Planner', icon: 'fa-solid fa-utensils', route: 'meal-planner' },
        { name: 'Lists', icon: 'fa-solid fa-list-check', route: 'lists' },
        ...(isParentSession ? [{ name: 'Family', icon: 'fa-solid fa-users', route: 'manage-family' }] : [])
    ];

    // Handle navigation clicks to update the route via hash change.
    const handleNavClick = (e, route) => {
        e.preventDefault();
        window.location.hash = route;
        setRoute(route);
    };

    return (
        <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 flex flex-col">
            <a href="#dashboard" onClick={(e) => handleNavClick(e, 'dashboard')} className="text-white flex items-center space-x-2 px-4">
                <i className="fa-solid fa-people-roof text-2xl"></i>
                <span className="text-2xl font-extrabold">FamiliFlow</span>
            </a>
            <nav className="flex-grow">
                {navItems.map(item => (
                    <a 
                        key={item.name} 
                        href={`#${item.route}`} 
                        onClick={(e) => handleNavClick(e, item.route)} 
                        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                    >
                        <i className={`${item.icon} mr-3 w-6 text-center`}></i>
                        {item.name}
                    </a>
                ))}
            </nav>
            <div className="px-2">
                <a href="#lock" onClick={(e) => { e.preventDefault(); lockSession(); }} className="block text-center py-2.5 px-4 rounded transition duration-200 hover:bg-yellow-700 bg-yellow-600 mb-2">
                    <i className="fa-solid fa-lock mr-3"></i>Lock to Kiosk
                </a>
                <a href="#logout" onClick={(e) => { e.preventDefault(); fullLogout(); }} className="block text-center py-2.5 px-4 rounded transition duration-200 hover:bg-red-700 bg-red-600">
                    <i className="fa-solid fa-right-from-bracket mr-3"></i>Logout
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
