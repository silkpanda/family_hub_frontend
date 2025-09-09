import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useSocket } from './SocketContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState({
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem('jwt_token'),
        activeHouseholdId: localStorage.getItem('active_household_id'),
        loading: true,
    });
    const { connectSocket, disconnectSocket, socket } = useSocket();
    const navigate = useNavigate();

    const fullLogout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('active_household_id');
        setSession({
            isAuthenticated: false,
            user: null,
            token: null,
            activeHouseholdId: null,
            loading: false,
        });
        disconnectSocket();
        navigate('/login');
    }, [disconnectSocket, navigate]);

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                try {
                    const data = await api.get('/auth/session');
                    setSession(prev => ({
                        ...prev,
                        isAuthenticated: true,
                        user: data.user,
                        activeHouseholdId: data.user.activeHouseholdId,
                        loading: false,
                    }));
                    connectSocket(token);
                } catch (error) {
                    console.error("Session verification failed:", error);
                    fullLogout();
                }
            } else {
                setSession(prev => ({ ...prev, loading: false }));
            }
        };

        verifySession();
    }, [connectSocket, fullLogout]);

    const login = (userData) => {
        localStorage.setItem('jwt_token', userData.token);
        localStorage.setItem('active_household_id', userData.user.activeHouseholdId);
        setSession({
            isAuthenticated: true,
            user: userData.user,
            token: userData.token,
            activeHouseholdId: userData.user.activeHouseholdId,
            loading: false,
        });
        connectSocket(userData.token);
    };

    const value = { session, login, logout: fullLogout, setSession, socket };

    return (
        <AuthContext.Provider value={value}>
            {!session.loading && children}
        </AuthContext.Provider>
    );
};
