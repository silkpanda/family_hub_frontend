// --- File: /frontend/src/context/SocketContext.js ---
// Establishes and provides a global WebSocket connection using Socket.IO.

import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// **BUG FIX:** The REACT_APP_API_URL includes '/api', which is correct for HTTP requests
// but incorrect for the base Socket.IO connection. The socket server listens on the root.
// This fix removes the '/api' suffix if it exists, ensuring the client connects to the correct URL.
const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace('/api', '');
console.log('[SocketContext] Attempting to connect to socket server at:', baseUrl);

const socket = io(baseUrl, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

console.log('[SocketContext] Socket instance created:', socket);

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        // The provider's role is to listen for connection status changes
        // and provide the socket instance to its children.

        socket.on('connect', () => {
            console.log('[SocketContext] Socket connected successfully with ID:', socket.id);
            setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
            console.log('[SocketContext] Socket disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
            // This is the error we are trying to diagnose.
            console.error('[SocketContext] Socket connection error:', err);
            setIsConnected(false);
        });

        // Cleanup function to remove listeners when the provider unmounts.
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
