// ===================================================================================
// File: /frontend/src/components/layout/Sidebar.js
// Purpose: The main navigation sidebar for the application.
//
// --- Dev Notes (UI Modernization) ---
// - The sidebar's background color is now a clean white to stand out against the
//   new light gray app background.
// - The active link style has been updated to use the new theme's accent color
//   for a more modern feel.
// - Spacing and typography have been adjusted for better clarity and alignment.
// - REFINEMENT: Added `flexShrink: 0` to the main style. This is a best practice
//   for fixed-width sidebars in a flex layout, as it explicitly prevents the
//   sidebar from shrinking if the main content area becomes too wide.
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
        flexShrink: 0, // --- NEW ---
        height: '100vh',
        backgroundColor: theme.colors.neutralSurface,
        borderRight: `1px solid #EAECEE`,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.lg,
        fontFamily: theme.typography.fontFamily,
    };

    const logoStyle = {
        ...theme.typography.h2,
        color: theme.colors.primaryBrand,
        textAlign: 'center',
        marginBottom: theme.spacing.xxl,
    };

    const navLinkStyle = {
        textDecoration: 'none',
        color: theme.colors.textSecondary,
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.borderRadius.medium,
        marginBottom: theme.spacing.sm,
        ...theme.typography.body,
        fontWeight: '500',
        transition: 'background-color 0.2s ease, color 0.2s ease',
    };
    
    const activeLinkStyle = {
        backgroundColor: theme.colors.primaryBrand,
        color: theme.colors.neutralSurface,
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
            <Button variant="tertiary" onClick={logout}>Logout</Button>
        </div>
    );
};
export default Sidebar;
