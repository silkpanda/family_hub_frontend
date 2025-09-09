import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { io } from "socket.io-client";
import { api } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState({ user: null, mode: 'loading', socket: null, activeHouseholdId: null });
    const isParentSession = session.mode === 'parent';

    const fullLogout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('active_household_id');
        if (session.socket) session.socket.disconnect();
        setSession({ user: null, mode: 'logged-out', socket: null, activeHouseholdId: null });
    }, [session.socket]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        
        if (tokenFromUrl) {
            localStorage.setItem('jwt_token', tokenFromUrl);
            window.history.replaceState({}, document.title, "/");
        }

        const validateSession = async () => {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                try {
                    const user = await api.get('/auth/session');
                    if (!user) throw new Error("User data not received.");
                    
                    const socket = io('http://localhost:5000');
                    
                    let activeHouseholdId = null;
                    if (user.households && user.households.length > 0) {
                        const lastActiveId = localStorage.getItem('active_household_id');
                        const householdIds = user.households.map(h => h._id || h);
                        activeHouseholdId = householdIds.includes(lastActiveId) ? lastActiveId : householdIds[0];
                        
                        if (activeHouseholdId) {
                            localStorage.setItem('active_household_id', activeHouseholdId);
                            socket.emit('joinHouseholdRoom', activeHouseholdId);
                        }
                    }
                    
                    setSession({ user, mode: 'kiosk', socket, activeHouseholdId });
                } catch (error) {
                    console.error("Session validation failed:", error);
                    fullLogout();
                }
            } else {
                setSession({ user: null, mode: 'logged-out', socket: null, activeHouseholdId: null });
            }
        };

        validateSession();
    // CORRECTED: The dependency array is now empty, so this effect will only run once.
    }, []);

    const refreshSession = useCallback(async () => {
        try {
            const user = await api.get('/auth/session');
            let activeHouseholdId = session.activeHouseholdId;
            if (user.households && user.households.length > 0) {
                const lastActiveId = localStorage.getItem('active_household_id');
                const householdIds = user.households.map(h => h._id || h);
                activeHouseholdId = householdIds.includes(lastActiveId) ? lastActiveId : householdIds[0];
                if(activeHouseholdId) {
                    localStorage.setItem('active_household_id', activeHouseholdId);
                }
            }
            setSession(s => ({ ...s, user, activeHouseholdId }));
        } catch (error) {
            console.error("Failed to refresh session:", error);
            fullLogout();
        }
    }, [fullLogout, session.activeHouseholdId]);

    const setPin = useCallback(async (pin) => {
        try {
            await api.post('/auth/pin/set', { pin });
            await refreshSession();
            return true;
        } catch (error) {
            return error.message || "An unknown error occurred.";
        }
    }, [refreshSession]);
    
    const googleLogin = useCallback(() => { window.location.href = `http://localhost:5000/api/auth/google`; }, []);

    const pinLogin = useCallback(async (pin) => {
        try {
            await api.post('/auth/pin/login', { pin });
            setSession(s => ({ ...s, mode: 'parent' }));
            return true;
        } catch (e) { return false; }
    }, []);

    const lockSession = useCallback(() => { setSession(s => ({ ...s, mode: 'kiosk' })); }, []);

    const value = useMemo(() => ({
        session, isParentSession, googleLogin, pinLogin, lockSession, fullLogout, refreshSession, setPin
    }), [session, isParentSession, googleLogin, pinLogin, lockSession, fullLogout, refreshSession, setPin]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
