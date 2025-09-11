import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useSocket } from './SocketContext';

export const AuthContext = createContext();

// This is the new custom hook that was missing
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isParentSession, setIsParentSession] = useState(false);
    const navigate = useNavigate();
    const { connectSocket, disconnectSocket } = useSocket();

    const fullLogout = useCallback(() => {
        api.post('/auth/logout').finally(() => {
            localStorage.removeItem('session_token');
            setSession(null);
            setIsParentSession(false);
            disconnectSocket();
            navigate('/login');
        });
    }, [disconnectSocket, navigate]);

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('session_token');
            if (token) {
                try {
                    const data = await api.get('/auth/session');
                    if (data && data.user) {
                        setSession(data);
                        setIsParentSession(data.isParent);
                        connectSocket(token);
                    } else {
                        throw new Error('Invalid session');
                    }
                } catch (error) {
                    fullLogout();
                }
            }
            setLoading(false);
        };
        verifySession();
    }, [connectSocket, fullLogout]);

    const lockSession = () => {
        setIsParentSession(false);
    };

    const unlockParentSession = async (pin) => {
        try {
            await api.post('/auth/verify-pin', { pin });
            setIsParentSession(true);
            return true;
        } catch (error) {
            console.error('PIN verification failed:', error);
            return false;
        }
    };

    const value = {
        session,
        setSession,
        loading,
        isParentSession,
        setIsParentSession,
        fullLogout,
        lockSession,
        unlockParentSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

