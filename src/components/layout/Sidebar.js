// --- File: /frontend/src/components/layout/Sidebar.js ---
// The main navigation sidebar for authenticated users.

import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { theme } from '../../theme/theme';
import Button from '../shared/Button';

const Sidebar = () => {
    // **UPDATE:** Get the new logout functions from the context.
    const { parentLogout, fullLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleParentLogout = () => {
        if (parentLogout) {
            parentLogout(navigate);
        }
    };

    const handleFullLogout = () => {
        if (fullLogout) {
            fullLogout(navigate);
        }
    };

    const sidebarStyle = {
        width: '240px',
        flexShrink: 0,
        height: '100vh',
        backgroundColor: theme.colors.neutralSurface,
        borderRight: `1px solid #EAECEE`,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.lg,
        fontFamily: theme.typography.fontFamily,
    };

    const logoStyle = { ...theme.typography.h2, color: theme.colors.primaryBrand, textAlign: 'center', marginBottom: theme.spacing.xxl };
    const navLinkStyle = { textDecoration: 'none', color: theme.colors.textSecondary, padding: `${theme.spacing.sm} ${theme.spacing.md}`, borderRadius: theme.borderRadius.medium, marginBottom: theme.spacing.sm, ...theme.typography.body, fontWeight: '500', transition: 'background-color 0.2s ease, color 0.2s ease' };
    const activeLinkStyle = { backgroundColor: theme.colors.primaryBrand, color: theme.colors.neutralSurface };

    return (
        <div style={sidebarStyle}>
            <h1 style={logoStyle}>Family Hub</h1>
            <nav style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <NavLink end to="/" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Dashboard</NavLink>
                <NavLink to="/calendar" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Calendar</NavLink>
                <NavLink to="/lists" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Lists</NavLink>
                <NavLink to="/chores" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Chores</NavLink>
                <NavLink to="/meals" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Meal Planner</NavLink>
                <NavLink to="/store" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Store</NavLink>
                <NavLink to="/family" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}>Family</NavLink>
            </nav>
            {/* **UPDATE:** Replaced the single logout button with two distinct actions. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                <Button variant="secondary" onClick={handleParentLogout}>End Parent Session</Button>
                <Button variant="tertiary" onClick={handleFullLogout}>Sign Out Completely</Button>
            </div>
        </div>
    );
};
export default Sidebar;
