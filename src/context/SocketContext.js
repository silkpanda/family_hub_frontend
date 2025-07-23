import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Only attempt to connect if the user is authenticated (has a token).
    if (token) {
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      
      // Pass the token in the 'auth' object. The backend's socket middleware
      // will use this for authentication before establishing the connection.
      const newSocket = io(backendUrl, {
        auth: {
          token: token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Socket.io connected successfully.');
        setSocket(newSocket);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket.io connection error:', err.message);
      });

      // Cleanup function to close the socket connection when the component unmounts
      // or when the user logs out (token becomes null).
      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [token]); // This effect re-runs whenever the token changes.

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
