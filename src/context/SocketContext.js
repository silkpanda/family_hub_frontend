// ===================================================================================
// File: /frontend/src/context/SocketContext.js
// Purpose: Creates and provides a single, stable WebSocket connection for the
// entire application.
// ===================================================================================
import React, { createContext } from 'react';
import { io } from 'socket.io-client';

// The socket URL is determined from environment variables.
const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
// Remove the '/api' suffix if present, as Socket.IO connects to the root URL of the server
const socketIoUrl = backendUrl.replace('/api', '');

// The socket instance is created *outside* the React component. This is a critical
// design choice to ensure that only ONE connection is ever created for the entire
// application lifecycle, preventing issues with React's Strict Mode and re-renders.
export const socket = io(socketIoUrl, {
  autoConnect: true,
  transports: ['websocket', 'polling'] // Ensure WebSocket is preferred
});

// Log socket connection status for debugging
socket.on('connect', () => {
  console.log('[SocketContext] Socket connected with ID:', socket.id);
});
socket.on('disconnect', () => {
  console.log('[SocketContext] Socket disconnected.');
});
socket.on('connect_error', (err) => {
  console.error('[SocketContext] Socket connection error:', err.message);
});

export const SocketContext = createContext();

// The provider's only job is to make the single socket instance available to the app.
export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};