// --- File: /frontend/src/context/AuthContext.js ---
// Manages authentication state, including user info, tokens, and login/logout functions.

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const login = useCallback((token) => {
        localStorage.setItem('authToken', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
    }, []);

    // **NEW FUNCTION:** Ends the parent session and returns to Kiosk Mode.
    const parentLogout = useCallback((navigate) => {
        localStorage.removeItem('authToken');
        // We keep the user object but set isAuthenticated to false.
        setIsAuthenticated(false);
        if (navigate) {
            navigate('/'); // Navigate to the dashboard, which will now be in Kiosk mode.
        }
    }, []);

    // **RENAMED FUNCTION:** Fully logs the user out of the application.
    const fullLogout = useCallback((navigate) => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        // The router in App.js will automatically redirect to /login.
        if (navigate) {
            navigate('/login');
        }
    }, []);

    const loginWithPin = useCallback(async (memberId, pin) => {
        try {
            const { token } = await authService.loginWithPin(memberId, pin);
            if (token) {
                login(token);
            }
        } catch (error) {
            console.error("PIN Login failed:", error);
            throw error;
        }
    }, [login]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    login(token);
                } else {
                    fullLogout(); // Use fullLogout if the token is expired.
                }
            } catch (error) {
                fullLogout();
            }
        }
        setIsReady(true);
    }, [login, fullLogout]);

    const contextValue = useMemo(() => ({
        user, isAuthenticated, isReady, login, parentLogout, fullLogout, loginWithPin
    }), [user, isAuthenticated, isReady, login, parentLogout, fullLogout, loginWithPin]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
