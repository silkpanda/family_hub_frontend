import React, { createContext, useContext, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const connectSocket = useCallback((token) => {
        // Ensure you don't create multiple connections
        if (socket && socket.connected) {
            return;
        }

        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        
        // The io function connects to the server
        const newSocket = io(backendUrl, {
            auth: {
                token: token,
            },
        });

        newSocket.on('connect', () => {
            console.log('Socket connected successfully:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        setSocket(newSocket);
    }, [socket]);

    const disconnectSocket = useCallback(() => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            console.log('Socket disconnected.');
        }
    }, [socket]);

    const value = {
        socket,
        connectSocket,
        disconnectSocket,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
