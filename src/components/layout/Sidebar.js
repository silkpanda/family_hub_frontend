// ===================================================================================
// File: /frontend/src/components/layout/Sidebar.js
// Purpose: The main navigation sidebar for the application.
//
// --- UPDATE ---
// 1. The "Dashboard" NavLink now points to the root route ("/").
// 2. The "Calendar" NavLink now points to the new "/calendar" route.
// ===================================================================================
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { theme } from '../../theme/theme';
import Button from '../shared/Button';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);

    const sidebarStyle = {
        width: '240px',
        height: '100vh',
        backgroundColor: theme.colors.neutralBackground,
        borderRight: `1px solid #e0e0e0`,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.md,
        fontFamily: theme.typography.fontFamily,
    };

    const logoStyle = {
        ...theme.typography.h3,
        color: theme.colors.primaryBrand,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    };

    const navLinkStyle = {
        textDecoration: 'none',
        color: theme.colors.textSecondary,
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        ...theme.typography.body,
        fontWeight: '500',
    };
    
    const activeLinkStyle = {
        backgroundColor: theme.colors.accentAction,
        color: theme.colors.textPrimary,
    };

    return (
        <div style={sidebarStyle}>
            <h1 style={logoStyle}>Family Hub</h1>
            <nav style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <NavLink end to="/" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Dashboard</NavLink>
                <NavLink to="/calendar" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Calendar</NavLink>
                <NavLink to="/lists" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Lists</NavLink>
                <NavLink to="/chores" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Chores</NavLink>
                <NavLink to="/meals" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Meal Planner</NavLink>
                <NavLink to="/family" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Family</NavLink>
            </nav>
            <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
    );
};
export default Sidebar;
